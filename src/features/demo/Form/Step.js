import React from 'react';

export default function Step({step, children}){
    return <div>
        <h4>{step.title}</h4>
        {children}
    </div>
}