import { connect } from 'react-redux';
import React from 'react';

const OrderInfo = ({from, to, price, departureDate, arrivalDate}) => {
    return (
        <div>
           {from}, {to}, {price}, {departureDate}, {arrivalDate}
        </div>
    );
};
const mapStateToProps = (state) => ({
    from:state.order.order.from,
    to:state.order.order.to,
    departureDate:state.order.order.departureDate,
    arrivalDate:state.order.order.arrivalDate,
    price: state.order.order.price,
})

// const mapDispatchToProps = {
    
// }


export default connect(mapStateToProps)(OrderInfo) ;