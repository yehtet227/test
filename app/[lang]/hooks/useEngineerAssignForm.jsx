import { addEndDate, addProjectId, addStartDate } from "@/app/store/client/features/engineer_assign/assignCreateSlice";
import { updateProject } from "@/app/store/client/features/engineer_assign/engineerAssignSlice";
import { useDispatch } from "react-redux"

export const useEngineerAssignForm = () => {
    const dispatch = useDispatch()
    const handleChange = (setterFunction, key, value) => {
        dispatch(setterFunction(value));
    }

    return {
         handleProjectChange: (selectedProject) => {
            handleChange(updateProject, 'project', selectedProject)
            handleChange(addProjectId, 'project_id', selectedProject?.id)
        },
    
        handleStartDateChange: (startDate) => {
            handleChange(addStartDate, 'start_date', startDate)
        },
    
        handleEndDateChange: (endDate) => {
            handleChange(addEndDate, 'end_date', endDate)
        }
    }
}