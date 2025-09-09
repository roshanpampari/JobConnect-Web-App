import React from "react";

function Input(props){
    return ( 
    <div >
    <label htmlFor={props.Label}>{props.Label}</label>
    <input type={props.Label} name={props.Name} value={props.Value} onChange={props.UpdtChange}/>
  </div>
  );
}

export default Input;