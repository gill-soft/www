import React, {useEffect} from 'react';
import { getTicketInfo } from '../services/api';

const TicketPage = ({match}) => {
useEffect(() => {
    const id =match.params.id
    getTicketInfo(id).then(({data})=> console.log(data))
    
}, [])
    return (
        <div>
           <p>TicketPage</p> 
        </div>
    );
};

export default TicketPage;