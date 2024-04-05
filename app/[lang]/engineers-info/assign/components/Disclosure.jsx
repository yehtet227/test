import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

export default function DisclosureFunction(props) {
    return (
        <div className="w-full">
            <div className="w-full rounded-2xl bg-white">
                <Disclosure defaultOpen={props?.editData}>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex w-full justify-between rounded-none border border-b-[1.5px] border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm font-medium text-black focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <span>{props?.disclosureName}</span>
                                <ChevronUpIcon
                                    className={`${
                                        open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-purple-500`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pb-4 pt-4 text-sm text-black">
                                {props?.disclosurePanel}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </div>
    )
}
