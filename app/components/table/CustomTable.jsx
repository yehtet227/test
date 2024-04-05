import {
    saveEmpCode,
    saveYear,
} from '@/app/store/client/features/customTable/customTableSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import AddIcon from '@/public/icon/addIcon.svg'
import ColumnsIcon from '@/public/icon/columnsIcon.svg'
import EditIcon from '@/public/icon/editicon.svg'
import FilterIcon from '@/public/icon/filterIcon.svg'
import SearchIcon from '@/public/icon/search.svg'
import Warnning from '@/public/warnning.svg'
import { Dialog, Listbox, Menu, Transition } from '@headlessui/react'
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import ErrorPage from '../error/ErrorPage'

const CustomTable = (props) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [modalSearchValue, setmodalSearchValue] = useState('')
    const [rowFilter, setRowFilter] = useState(null)
    const [rowFilterValue, setRowFilterValue] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [columnsToSearch, setColumnsToSearch] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [hasSelected, setHasSelected] = useState(false)
    const [loading, setLoading] = useState(true)
    let [isOpen, setIsOpen] = useState(false)
    const [upIcon, setUpIcon] = useState(false)
    const year = useSelector((state) => state.customTable)
    const showyear = year?.year
    const pathname = usePathname()
    const segments = pathname.split('/')
    const currentpage = segments[segments.length - 1]
    useEffect(() => {
        if (selectedRowKeys?.length > 0) {
            setHasSelected(true)
        }
    }, [selectedRowKeys])

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    useEffect(() => {
        // Set columnsToSearch to the searchColumns from props, or the first column's dataIndex if searchColumns is not provided
        if (props?.searchColumns) {
            setColumnsToSearch(props?.searchColumns)
        } else {
            setColumnsToSearch([props?.columns[0]?.dataIndex])
        }
    }, [props?.searchColumns, props?.columns])
    const [filteredDataByColumn, setFilteredDataByColumn] = useState({})
    const initialCheckboxValues = props?.columns?.reduce(
        (initialValues, column) => {
            initialValues[column?.title] = true
            return initialValues
        },
        {},
    )
    const [checkboxValues, setCheckboxValues] = useState({
        ...initialCheckboxValues,
    })
    const pageSize = 20 // Number of rows to load at a time
    const [currentPage, setCurrentPage] = useState(1)
    const [currentData, setCurrentData] = useState([])
    const [filteredData, setFilteredData] = useState(currentData)
    const tableRef = useRef()

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = tableRef.current
        if (scrollTop + clientHeight >= scrollHeight) {
            if (currentPage < Math.ceil(props?.data?.length / pageSize)) {
                setCurrentPage(currentPage + 1)
            }
        }
    }

    useEffect(() => {
        const loadMoreData = () => {
            const startIndex = (currentPage - 1) * pageSize
            const endIndex = currentPage * pageSize
            const newData = props?.data?.slice(startIndex, endIndex)
            setCurrentData((prevData) => [...prevData, ...newData])
        }
        props?.isSuccess && loadMoreData()
    }, [currentPage, props?.data, props?.isSuccess]) // Load data when currentPage changes
    // column filter item
    const columnFilterItem = props?.columns
        ?.slice(1)
        ?.filter((item) =>
            item?.title
                ?.toLowerCase()
                .replace(/\s/g, '')
                ?.includes(modalSearchValue.toLowerCase().replace(/\s/g, '')),
        )
    // Function to set the row filter based on the selected row name
    const handleRowFilter = (rowName) => {
        setRowFilter(rowName)
    }
    // Function to extract text content from React elements
    const extractTextFromReactElement = (element, uniqueSet) => {
        if (typeof element === 'string') {
            uniqueSet.add(element);
        } else if (typeof element === 'number') {
            uniqueSet.add(element);
        } else if (Array.isArray(element)) {
            element.forEach((child) => {
                extractTextFromReactElement(child, uniqueSet);
            });
        } else if (React.isValidElement(element)) {
            extractTextFromReactElement(element.props.children, uniqueSet);
        } 
    };
    
    const rowFilterItemData = props?.isSuccess
        ? props?.data
              ?.filter(
                  (rowItem) =>
                      rowItem[rowFilter] !== undefined &&
                      rowItem[rowFilter] !== null
              )
              .reduce((uniqueData, rowItem) => {
                  const value = rowItem[rowFilter];
                  const uniqueSet = new Set();
                  extractTextFromReactElement(value, uniqueSet);
    
                  uniqueSet.forEach((textValue) => {
                      if (textValue !== '') {
                          uniqueData.add(textValue);
                      } else {
                          uniqueData.add('Blank');
                      }
                  });
                  return uniqueData;
              }, new Set())
        : new Set();
    
    const rowFilterItem = [...rowFilterItemData];
    
    const [columnFilters, setColumnFilters] = useState({})
    // Initialize filters for each column
    useEffect(() => {
        const initialFilters = {}
        props?.columns?.forEach((column) => {
            initialFilters[column?.dataIndex] = []
        })
        setColumnFilters(initialFilters)
    }, [props?.columns])
    // Function to set the row filter based on the selected column
    const handleColumnFilter = (columnDataIndex, value) => {
        const updatedFilters = { ...columnFilters }
        const currentFilters = updatedFilters[columnDataIndex]
        if (currentFilters.includes(value)) {
            updatedFilters[columnDataIndex] = currentFilters.filter(
                (item) => item !== value,
            )
        } else {
            updatedFilters[columnDataIndex] = [...currentFilters, value]
        }
        setColumnFilters(updatedFilters)
    }
    // Define a function to filter data and update the state
    useEffect(() => {
        const filteredData = {}

        props?.columns?.forEach((column) => {
            const uniqueValues = new Set()

            props?.data?.forEach((rowItem) => {
                let columnValue
                // Loop through the array of elements
                if (Array.isArray(rowItem[column?.dataIndex])) {
                    rowItem[column?.dataIndex]?.forEach((element, index) => {
                        if (
                            element.type === 'span'  &&
                            element.props &&
                            element.props.children
                        ) {
                            columnValue = element.props.children[0]
                        }else {
                            columnValue = element.props.children[0]
                        }
                    })
                } else {
                    columnValue = rowItem[column?.dataIndex]
                }
                // Check if the columnValue is in the columnFilters for the current column
                if (columnFilters[column?.dataIndex]?.includes(columnValue)) {
                    uniqueValues.add(columnValue)
                }
            })
            filteredData[column?.dataIndex] = Array.from(uniqueValues)
        })
        setFilteredDataByColumn(filteredData)
    }, [columnFilters, props?.columns, props?.data])

    // Define a function to toggle the checkbox value
    const handleCheckboxChange = (key) => {
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [key]: !prevValues[key], // Toggle the checkbox value
        }))
    }
    // Define a function to toggle all checkboxes at once
    const handleAllCheckboxChange = () => {
        const allChecked = Object.values(checkboxValues).every((value) => value)
        const newCheckboxValues = {}

        // Exclude the first column from being changed to false
        let isFirstColumn = true

        Object.keys(checkboxValues).forEach((key) => {
            if (isFirstColumn) {
                newCheckboxValues[key] = true // Always keep the first column as true
                isFirstColumn = false
            } else {
                newCheckboxValues[key] = !allChecked
            }
        })

        setCheckboxValues(newCheckboxValues)
    }

    const currentYear = new Date().getFullYear()
    const yearsList = []
    for (let year = 2011; year <= currentYear + 1; year++) {
        yearsList.push(year)
    }

    // Function to handle year selection
    const handleYearSelection = (year) => {
        dispatch(saveYear(year))
    }
    const extractText = (obj) => {
        const newObj = {}
        Object.keys(obj).forEach((key) => {
            if (Array.isArray(obj[key])) {
                newObj[key] = obj[key].map((item) =>
                    item.$$typeof === Symbol.for('react.element') &&
                    item.props &&
                    item.props.children
                        ? item.props.children
                        : item,
                )
            } else if (
                obj[key] &&
                obj[key].$$typeof === Symbol.for('react.element') &&
                obj[key].props &&
                obj[key].props.children
            ) {
                newObj[key] = obj[key].props.children
            } else {
                newObj[key] = obj[key]
            }
        })
        return newObj
    }
    //filter function
    const handleSearch = useCallback(
        async (e) => {
            const input = e?.target?.value

            // Filter data based on the search input
            const filteredBySearch = props?.data?.filter((item) => {
                for (const column of columnsToSearch) {
                    if (
                        item[column] &&
                        item[column]?.toString()?.includes(input)
                    ) {
                        return true
                    }
                }
                return false
            })

            setSearchInput(input)

            // Filter data by each column using filteredDataByColumn
            const filteredByColumns = Object.keys(columnFilters).reduce(
                (result, column) => {
                    // Assuming 'result' is your data array
                    const updatedData = result?.map((item) => extractText(item))

                    const columnValues = columnFilters[column]

                    if (columnValues.length > 0) {
                        result = updatedData.filter((item) => {
                            if (Array.isArray(item[column])) {
                                // If item[column] is an array, check if any element is included in columnValues
                                return item[column].some((val) =>
                                    columnValues.includes(val[0]),
                                )
                            } else {
                                // If it's not an array, directly check for inclusion
                                return columnValues.includes(item[column])
                            }
                        })
                    }
                    return result
                },
                filteredBySearch, // Filtered by search results
            )

            setFilteredData(filteredByColumns)
            // Check if the length of filtered data is greater than 0 and set loading to false
            if (filteredByColumns?.length > 0) {
                setLoading(false)
            }
        },
        [props.data, columnsToSearch, columnFilters],
    )

    useEffect(() => {
        // Whenever currentData, columnsToSearch, or selectedYear change, update the filteredData
        handleSearch({ target: { value: searchInput } })
    }, [currentData, columnsToSearch, searchInput, handleSearch])

    // chooseAction
    let chooseAction = []
    if (selectedRowKeys?.length > 1) {
        chooseAction = [
            {
                action: 'Delete',
            },
        ]
    } else {
        chooseAction = [
            {
                action: 'Edit',
            },
            {
                action: 'Delete',
            },
        ]
    }

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // Define an enum-like constant for actions
    const actions = {
        delete: 'Delete',
        edit: 'Edit',
    }

    // Handle ChooseAction
    const handleChooseAction = (action) => {
        if (action.action === actions.delete) {
            openModal()
        } else if (action.action === actions.edit) {
            router.push(`${props?.editRouteUrl}/${selectedRowKeys[0]}`)
        }
    }

    //delete data function
    const handleDelete = () => {
        props?.delete(selectedRowKeys)
        closeModal()
        toast.success('Successfully deleted!')
        setHasSelected(false)
        setSelectedRowKeys([])
    }

    //sidebar open and close function
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    const activeFilterColumn = Object.keys(filteredDataByColumn).filter(
        (column) => filteredDataByColumn[column].length > 0,
    )
    return (
        <>
            <Toaster />
            {/** delete modalbox start */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[400px] max-w-md transform overflow-hidden rounded-2xl border border-gray-500 bg-[#FBFBFB] p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-center">
                                        <Image
                                            src={Warnning}
                                            className="mb-5 h-[40px] w-[40px]"
                                            alt="no image"
                                        />
                                    </div>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Are you sure to delete?
                                    </Dialog.Title>

                                    <div className="mt-4 text-center">
                                        <button
                                            type="button"
                                            className="mr-5 inline-flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 font-medium text-black hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-yellow-300 px-4 py-2 font-medium text-black hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/** delete modalbox end */}
            {/** header start */}
            <div className=" border-b border-gray-300 text-xs">
                <div className="flex flex-row items-center justify-between gap-2 py-2">
                    {/** humburger button start */}
                    <div className="flex flex-row items-center">
                        <div className="cursor-pointer" onClick={toggleSideBar}>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        </div>
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder={
                                    props?.placeholder
                                        ? props?.placeholder
                                        : 'Search...'
                                }
                                value={searchInput}
                                onChange={handleSearch}
                                className=" py-2 pl-10 pr-4  focus:outline-none"
                                style={{ width: '600px' }}
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Image
                                    src={SearchIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </div>
                        </div>
                    </div>
                    {/** humburger button end */}
                    {/** right button group start */}
                    <div className="flex items-center gap-0 text-right">
                        {/** current year button start */}
                        {props?.yearBtn && (
                            <div className="mr-[-14px] w-[100px]">
                                {/* Reduced width here */}
                                <Listbox as="div" value={showyear}>
                                    <>
                                        <div className="relative w-[70px] text-xs">
                                            <Listbox.Button
                                                className="inline-flex h-[30px] w-[70px] items-center justify-center rounded-md bg-[#E6E7F3] text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                onClick={() => setUpIcon(true)}
                                            >
                                                <p className="mr-2">
                                                    {showyear}
                                                </p>
                                                {upIcon ? (
                                                    <ChevronUpIcon
                                                        className="h-4 w-4 text-gray-500"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <ChevronDownIcon
                                                        className="h-4 w-4 text-gray-500"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                                afterLeave={() => {
                                                    setUpIcon(false)
                                                }}
                                            >
                                                <Listbox.Options
                                                    className={`${
                                                        open
                                                            ? 'block'
                                                            : 'hidden'
                                                    } no-scrollbar absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                                                >
                                                    {yearsList.map(
                                                        (year, index) => (
                                                            <Listbox.Option
                                                                key={index}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-pointer select-none py-2 text-center hover:bg-blue-500 hover:text-white ${
                                                                        active
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'text-gray-900'
                                                                    }`
                                                                }
                                                                value={year}
                                                            >
                                                                {({
                                                                    selected,
                                                                    active,
                                                                }) => (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleYearSelection(
                                                                                year,
                                                                            )
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={`block truncate pl-2 ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                year
                                                                            }
                                                                        </span>
                                                                        {selected ? (
                                                                            <span
                                                                                className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
                                                                                    active
                                                                                        ? 'bg-blue-500 text-white'
                                                                                        : 'text-blue-500'
                                                                                }`}
                                                                            >
                                                                                <CheckIcon
                                                                                    className="h-4 w-4"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                        ) : null}
                                                                    </div>
                                                                )}
                                                            </Listbox.Option>
                                                        ),
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                </Listbox>
                            </div>
                        )}

                        {/** current year button end */}
                        {/** columns filter button start */}
                        {props?.columnsFilterBtn && (
                            <Menu
                                as="div"
                                className="relative inline-block text-left outline-none"
                            >
                                <div>
                                    <Menu.Button className="inline-flex h-[30px] w-full items-center justify-center rounded-md bg-blue-700 px-4 font-medium text-white  shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                        <Image
                                            src={ColumnsIcon}
                                            className="mr-2 h-[11px] w-[13px]"
                                            alt="no image"
                                        />
                                        Columns
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border-[1px] border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <div className="mb-2 border-b-[2px] border-gray-200">
                                                <div className="group flex w-full items-center rounded-md px-2 py-2 text-gray-900">
                                                    Column filter
                                                </div>
                                            </div>

                                            <div
                                                className={`'h-auto py-2' }
                                        px-2`}
                                            >
                                                <div className="relative mb-2 w-full text-gray-400 focus-within:text-gray-600">
                                                    <input
                                                        type="text"
                                                        className="block w-full rounded-md border px-2 py-1 focus:outline-none"
                                                        placeholder="Search..."
                                                        value={modalSearchValue}
                                                        onChange={(e) => {
                                                            setmodalSearchValue(
                                                                e.target.value,
                                                            )
                                                        }}
                                                    />
                                                </div>
                                                <div className="no-scrollbar max-h-[200px] overflow-x-auto">
                                                    <div className="px-1">
                                                        <div className="py-1">
                                                            {columnFilterItem.length >
                                                            0 ? (
                                                                <label className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="text-blue-500 focus:ring-blue-200"
                                                                        checked={Object.values(
                                                                            checkboxValues,
                                                                        ).every(
                                                                            (
                                                                                value,
                                                                            ) =>
                                                                                value,
                                                                        )}
                                                                        onChange={
                                                                            handleAllCheckboxChange
                                                                        }
                                                                    />
                                                                    <span>
                                                                        All
                                                                    </span>
                                                                </label>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {columnFilterItem?.map(
                                                        (
                                                            columnfilteritem,
                                                            index,
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="px-1"
                                                            >
                                                                <div className="py-1">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="text-blue-500 focus:ring-blue-200"
                                                                            checked={
                                                                                checkboxValues[
                                                                                    columnfilteritem
                                                                                        .title
                                                                                ]
                                                                            }
                                                                            onChange={() =>
                                                                                handleCheckboxChange(
                                                                                    columnfilteritem.title,
                                                                                )
                                                                            }
                                                                        />
                                                                        <span>
                                                                            {
                                                                                columnfilteritem?.title
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        )}

                        {/** columns filter button end */}
                        {/** add button start */}
                        {props?.addBtn && (
                            <Link
                                href={
                                    props?.addRouteUrl ? props?.addRouteUrl : ''
                                }
                            >
                                <div className="ml-2">
                                    <div>
                                        <button className="inline-flex h-[30px] w-[60px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                            <Image
                                                src={AddIcon}
                                                className=" mr-1 mt-[1px] w-3"
                                                alt="no image"
                                            />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/** add button end */}
                    </div>
                    {/** right button group end */}
                </div>
            </div>
            {/** header end */}
            {/** choose action button start */}
            {hasSelected && selectedRowKeys?.length > 0 && (
                <div
                    className={`${
                        hasSelected
                            ? 'mt-3 bg-blue-700 px-5 py-2'
                            : 'white mt-[7px]'
                    } flex items-center`}
                >
                    <span
                        className={`ml-2 mr-2 text-${
                            hasSelected ? 'white' : 'black'
                        }`}
                    >
                        {hasSelected
                            ? `${selectedRowKeys.length} row selected`
                            : ''}
                    </span>
                    {hasSelected && selectedRowKeys.length > 0 && (
                        <Listbox as="div" className="mr-3">
                            <>
                                <div className="relative">
                                    <Listbox.Button
                                        className={`inline-flex w-[160px] justify-between rounded-md bg-white px-3 py-2 text-sm text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                    >
                                        Choose Action
                                        <ChevronDownIcon className="ml-1 h-5 w-5 text-black" />
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Listbox.Options className="absolute z-50 mt-1 w-[160px] divide-y divide-gray-200 rounded border border-gray-300 bg-white p-1 text-left shadow-md">
                                            {chooseAction?.map((action) => (
                                                <Listbox.Option
                                                    key={action.action}
                                                    value={action}
                                                    className="cursor-pointer px-3 py-2"
                                                    onClick={() => {
                                                        handleChooseAction(
                                                            action,
                                                        )
                                                    }}
                                                >
                                                    {action.action}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        </Listbox>
                    )}
                </div>
            )}
            {/** choose action button end */}
            <div className="relative min-h-screen overflow-hidden">
                {filteredData?.length === 0 && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        No data
                    </div>
                )}
                {props?.isLoading && (
                    <div className="absolute inset-0 mt-[50px] flex items-center justify-center text-center">
                        <div className="flex h-full items-center justify-center">
                            <div>
                                <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        Loading...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading && props?.isSuccess && (
                    <div className="absolute inset-0 mt-[50px] flex items-center justify-center text-center">
                        <div className="flex h-full items-center justify-center">
                            <div>
                                <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        Loading...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-32">
                    {props?.isError && (
                        <ErrorPage message={currentpage} status={'500'} />
                    )}
                </div>

                <div className="h-auto">
                    <div>
                        <div
                            className={`no-scrollbar absolute inset-0 mb-3 overflow-x-auto ${
                                selectedRowKeys?.length === 0 && 'mt-3'
                            } ${
                                props?.isError &&
                                'max-h-[200px] rounded-md border'
                            }`}
                            onScroll={handleScroll}
                            ref={tableRef}
                        >
                            <table
                                className={`w-full table-fixed border-separate border-spacing-0`}
                            >
                                {/** table header start */}
                                <thead className="sticky top-0 z-10">
                                    <tr className="h-[43px]">
                                        {/** if checkoutBox true show checkoutBox in table */}
                                        {props?.checkoutBox && (
                                            <th className="sticky left-0 z-10 w-20 rounded-tl-md border-b-[1px] border-l-[1px] border-t-[1px] bg-gray-50 px-1 text-center text-sm text-white">
                                                <input
                                                    className="mt-[4px] h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 ring-offset-2 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-blue-800"
                                                    type="checkbox"
                                                    onChange={() => {
                                                        const keys =
                                                            filteredData?.map(
                                                                (item) =>
                                                                    item.key,
                                                            )
                                                        setSelectedRowKeys(
                                                            selectedRowKeys.length ===
                                                                keys.length
                                                                ? []
                                                                : keys,
                                                        )
                                                    }}
                                                    checked={
                                                        filteredData?.length >
                                                            0 &&
                                                        selectedRowKeys.length ===
                                                            filteredData?.length
                                                    }
                                                />
                                            </th>
                                        )}
                                        {/** if editBtn true show editBtn in table */}
                                        {props?.editBtn && (
                                            <td className="sticky left-0 z-10 w-14 rounded-tl-md border-b-[1px] border-l-[1px] border-t-[1px] bg-gray-50 px-2 text-center"></td>
                                        )}

                                        {props?.columns
                                            ?.filter(
                                                (column) =>
                                                    checkboxValues[
                                                        column?.title
                                                    ],
                                            )
                                            ?.map((column, index) => (
                                                <th
                                                    key={column?.dataIndex}
                                                    className={`w-[${
                                                        column?.width
                                                    }px] sticky ${
                                                        props?.checkoutBox &&
                                                        `left-[80px]`
                                                    } ${
                                                        props?.editBtn
                                                            ? 'left-[56px]'
                                                            : 'left-0'
                                                    } border-b-[1px] border-r-[1px] border-t-[1px] bg-gray-50  text-sm font-medium text-gray-500 ${
                                                        index === 0
                                                            ? 'z-10 border-l-[1px]'
                                                            : ''
                                                    } ${
                                                        index ===
                                                        props?.columns?.length -
                                                            1
                                                            ? 'rounded-tr-md border-r-[1px]'
                                                            : ''
                                                    }`}
                                                >
                                                    {column?.title}
                                                    {/** filter button in table start */}
                                                    {props?.columnsDataFilter &&
                                                        !props?.columnsDataFilterhiddenName?.includes(
                                                            column?.title,
                                                        ) && (
                                                            <div className="absolute bottom-0 right-2 cursor-pointer">
                                                                <Menu
                                                                    as="div"
                                                                    className="text-left"
                                                                >
                                                                    <div
                                                                        onClick={() =>
                                                                            handleRowFilter(
                                                                                column?.dataIndex,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Menu.Button
                                                                            className={`relative w-full select-none text-sm font-medium text-white focus:outline-none`}
                                                                        >
                                                                            <Image
                                                                                src={
                                                                                    FilterIcon
                                                                                }
                                                                                alt="no image"
                                                                            />
                                                                            {activeFilterColumn?.includes(
                                                                                column?.dataIndex,
                                                                            ) && (
                                                                                <div className="absolute right-[-5px] top-[-5px]">
                                                                                    <div className="flex h-2 w-2 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white"></div>
                                                                                </div>
                                                                            )}
                                                                        </Menu.Button>
                                                                    </div>
                                                                    <Transition
                                                                        as={
                                                                            Fragment
                                                                        }
                                                                        className="z-20"
                                                                        enter="transition ease-out duration-100"
                                                                        enterFrom="transform opacity-0 scale-95"
                                                                        enterTo="transform opacity-100 scale-100"
                                                                        leave="transition ease-in duration-75"
                                                                        leaveFrom="transform opacity-100 scale-100"
                                                                        leaveTo="transform opacity-0 scale-95"
                                                                    >
                                                                        <Menu.Items className="absolute right-0 mt-2 max-h-80 w-auto origin-top-right divide-y divide-gray-100 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                            <div className="py-1">
                                                                                <div className="select-none overflow-x-auto whitespace-nowrap px-3">
                                                                                    <div className="max-h-160 overflow-y-auto px-1">
                                                                                        {rowFilterItem?.map(
                                                                                            (
                                                                                                rowfilteritem,
                                                                                                index,
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                    className="py-1"
                                                                                                >
                                                                                                    <label className="flex cursor-pointer items-center space-x-2">
                                                                                                        <input
                                                                                                            checked={columnFilters[
                                                                                                                column
                                                                                                                    ?.dataIndex
                                                                                                            ].includes(
                                                                                                                rowfilteritem,
                                                                                                            )}
                                                                                                            onChange={() =>
                                                                                                                handleColumnFilter(
                                                                                                                    column?.dataIndex,
                                                                                                                    rowfilteritem,
                                                                                                                )
                                                                                                            }
                                                                                                            type="checkbox"
                                                                                                            className="text-blue-500 focus:ring-blue-200"
                                                                                                        />
                                                                                                        <span className="no-scrollbar max-w-[300px] text-sm ">
                                                                                                            {
                                                                                                                rowfilteritem
                                                                                                            }
                                                                                                        </span>
                                                                                                    </label>
                                                                                                </div>
                                                                                            ),
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Menu.Items>
                                                                    </Transition>
                                                                </Menu>
                                                            </div>
                                                        )}

                                                    {/** filter button in table end */}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>

                                {/** table header end */}
                                {/** table body start */}
                                <tbody className="text-xs">
                                    {props?.isError && (
                                        <div className="absolute inset-0 mt-[50px] flex items-center justify-center text-center">
                                            Data can not fetch.
                                        </div>
                                    )}

                                    {props?.isSuccess &&
                                        filteredData?.map((item, rowIndex) => (
                                            <tr
                                                key={rowIndex}
                                                className="text-left"
                                            >
                                                {/** if checkoutBox true show checkoutBox in table */}
                                                {props?.checkoutBox && (
                                                    <td className="sticky left-0 w-10 border-b-[1px] border-l-[1px] bg-white px-1 text-center">
                                                        <input
                                                            className="mt-[4px] h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600  ring-offset-2 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-blue-800"
                                                            type="checkbox"
                                                            onChange={() => {
                                                                const newSelectedRowKeys =
                                                                    selectedRowKeys.includes(
                                                                        item.key,
                                                                    )
                                                                        ? selectedRowKeys.filter(
                                                                              (
                                                                                  key,
                                                                              ) =>
                                                                                  key !==
                                                                                  item.key,
                                                                          )
                                                                        : [
                                                                              ...selectedRowKeys,
                                                                              item.key,
                                                                          ]
                                                                onSelectChange(
                                                                    newSelectedRowKeys,
                                                                )
                                                            }}
                                                            checked={selectedRowKeys.includes(
                                                                item.key,
                                                            )}
                                                        />
                                                    </td>
                                                )}
                                                {/** if editBtn true show editBtn in table */}
                                                {props?.editBtn && (
                                                    <td
                                                        className={`sticky left-0 w-14 border-b-[1px]  border-l-[1px] bg-white`}
                                                    >
                                                        <Link
                                                            href={`${props?.editRouteUrl}/${item?.key}`}
                                                        >
                                                            <div
                                                                className="flex justify-center"
                                                                onClick={() => {
                                                                    dispatch(
                                                                        saveEmpCode(
                                                                            item?.EmployeeNumber,
                                                                        ),
                                                                    )
                                                                }}
                                                            >
                                                                <Image
                                                                    src={
                                                                        EditIcon
                                                                    }
                                                                    className="w-[18px] cursor-pointer"
                                                                    alt="no image"
                                                                />
                                                            </div>
                                                        </Link>
                                                    </td>
                                                )}
                                                {props?.columns
                                                    ?.filter(
                                                        (column) =>
                                                            checkboxValues[
                                                                column.title
                                                            ],
                                                    )
                                                    ?.map(
                                                        (column, colIndex) => (
                                                            <td
                                                                key={
                                                                    column?.title
                                                                }
                                                                className={`sticky ${
                                                                    colIndex ===
                                                                    0
                                                                        ? `border-l-[1px]`
                                                                        : 'z-[-1]'
                                                                } ${
                                                                    props?.checkoutBox &&
                                                                    `left-[${column.align}px]`
                                                                }  ${
                                                                    props?.editBtn
                                                                        ? 'left-[56px]'
                                                                        : 'left-0'
                                                                } w-96 border-b-[1px] border-r-[1px] bg-white p-2 px-2`}
                                                            >
                                                                {column?.title ===
                                                                'Year'
                                                                    ? item.Year
                                                                    : item[
                                                                          column
                                                                              ?.dataIndex
                                                                      ]}
                                                            </td>
                                                        ),
                                                    )}
                                            </tr>
                                        ))}
                                </tbody>

                                {/** table body end */}
                            </table>
                        </div>
                    </div>
                </div>

                {/** table end */}
            </div>
        </>
    )
}

export default CustomTable
