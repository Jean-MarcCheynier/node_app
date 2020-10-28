import React, {useState} from 'react';
import Step from './Step';

import { Document, Page } from 'react-pdf'; 
import { pdfjs } from 'react-pdf';

import Button from 'react-bootstrap/Button';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Step3({step}){

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
  
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }

    return <Step step={step}>
        <Document file={`./European-Accident-Statement.pdf`}
            onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber}
                renderInteractiveForms={true} />
        </Document>
        <Button disabled={pageNumber === 1} 
            onClick={e => setPageNumber(pageNumber-1)}>
                Previous
        </Button>
        <Button disabled={pageNumber === numPages} 
            onClick={e => setPageNumber(pageNumber+1)}>
                Next</Button>

    </Step>
} 