import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


export default function AppLoader(){
    return <div className="fixed-top d-flex vh-100 vw-100" style={{zIndex: '990'}}>
        <div className="m-auto text-center text-primary">
            <FontAwesomeIcon icon={faSpinner} spin size="6x"/>
        </div>
    </div>
}
