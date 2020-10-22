import React, {useState, useCallback, useMemo} from 'react';

import Button from 'react-bootstrap/Button';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
//import UploadForm from '....//uploadPicture/UploadForm';

const initialSteps = [
    {
        id: 1,
        title: "ID",
        component: Step1,
        isActive: true,
        next: 2
    },
    {
        id: 2,
        title: "Damage",
        component: Step2,
        isActive: false,
        previous: 1,
        next: 3
    },
    {
        id: 3,
        title: "Validation",
        component: Step3,
        isActive: false,
        previous: 2
    },
]


export default function Wrapper(props) {

    const [steps, setSteps] = useState(initialSteps);
    const [form, setForm] = useState();

    const activeStep = useMemo(() => {
        return steps.find(step => step.isActive);
    }, [steps])

    const renderStep = useCallback(() => {   
        return React.createElement(activeStep.component, {step: activeStep})
    }, [activeStep])

    const next = () => {
        setSteps( prevSteps => {
            prevSteps.forEach(step => {
                console.log(`Active == ${activeStep.id} Current = ${step.id}`  )
                return step.isActive = (activeStep.next === step.id);
            });
            console.log(prevSteps);
            return [...prevSteps];
        })
    }

    const previous = () => {
        setSteps( prevSteps => {
            prevSteps.forEach(step => {
                return step.isActive = (activeStep.previous === step.id);
            });
            return [...prevSteps];
        })
    }
    

    return <div className="form-wrapper">
        {renderStep()}
        <div className="text-center">
            <Button disabled={!activeStep.hasOwnProperty('previous')} onClick={previous}>Previous</Button>
            <Button disabled={!activeStep.hasOwnProperty('next')} onClick={next}>Next</Button>
        </div>
    </div>
}