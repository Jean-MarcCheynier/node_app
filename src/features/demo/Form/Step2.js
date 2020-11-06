import React from 'react';

import UploadForm from '../../uploadPicture/UploadForm';
import Step from './Step';

export default function Step2({step}){
    return <Step step={step}>
         <UploadForm documentType="damage"/>
    </Step>
} 