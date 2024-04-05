import React, { useState } from 'react'

const ProjectAssignDynamic = () => {
    const [formFields, setFormFields] = useState([
        {
            project_type: '',
            customer_id: '',
            project_id: '',
            role: '',
            man_month: '',
            unit_price: '',
            member_type: '',
        },
    ])

    const handleFormChange = (event, index) => {
        let data = [...formFields]
        data[index][event.target.name] = event.target.value
        setFormFields(data)
    }

    const submit = (e) => {
        e.preventDefault()
        console.log(formFields)
    }

    const addFields = () => {
        let object = {
            project_type: '',
            customer_id: '',
            project_id: '',
            role: '',
            man_month: '',
            unit_price: '',
            member_type: '',
        }

        setFormFields([...formFields, object])
    }

    const removeFields = (index) => {
        let data = [...formFields]
        data.splice(index, 1)
        setFormFields(data)
    }

    return (
        <div className="App">
            <form onSubmit={submit}>
                {formFields.map((form, index) => {
                    return (
                        <div key={index}>
                            <select
                                name="project_type"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.project_type}
                            >
                                <option value="projectType1">
                                    Project Type 1
                                </option>
                                <option value="projectType2">
                                    Project Type 2
                                </option>
                            </select>
                            <input
                                name="customer_id"
                                placeholder="customer_id"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.customer_id}
                            />
                            <input
                                name="project_id"
                                placeholder="project_id"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.project_id}
                            />
                            <input
                                name="role"
                                placeholder="role"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.role}
                            />
                            <input
                                name="man_month"
                                placeholder="man_month"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.man_month}
                            />
                            <input
                                name="unit_price"
                                placeholder="unit_price"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.unit_price}
                            />
                            <input
                                name="member_type"
                                placeholder="member_type"
                                onChange={(event) =>
                                    handleFormChange(event, index)
                                }
                                value={form.member_type}
                            />
                            {index !== 0 && (
                                <button onClick={() => removeFields(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    )
                })}
            </form>
            <button onClick={addFields}>Add More..</button>
            <br />
            <button onClick={submit}>Submit</button>
        </div>
    )
}

export default ProjectAssignDynamic
