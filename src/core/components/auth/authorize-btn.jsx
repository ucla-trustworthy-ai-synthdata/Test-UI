import React from "react"
import PropTypes from "prop-types"
import { toggleInstances } from "../operation-summary"
import { instances } from "../execute";

export let ranAlltest = false;
export const resetAlltest = ()=>{
  ranAlltest = false
}

let passes = 0
let fails = 0

export default class AuthorizeBtn extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    isAuthorized: PropTypes.bool,
    showPopup: PropTypes.bool,
    getComponent: PropTypes.func.isRequired,
    result: PropTypes.bool,
  }

  TestAll = () =>{
    ranAlltest = true
    passes = 0
    instances.forEach(inst =>  passes += inst.onClick())
    fails =  instances.length - passes
  }
  
  UpdateIsAllOpen = () =>{
    let result = 0
    toggleInstances.forEach(inst =>  result += !inst.isShown())
    return !result
  }

  AllOpen = () =>{
    toggleInstances.forEach(inst => {
      if (!inst.isShown())
        inst.Toggle()
    })
    this.forceUpdate()
  }


  render() {
    let { isAuthorized, showPopup, onClick, getComponent } = this.props
    let allOpen = this.UpdateIsAllOpen()
    //must be moved out of button component
    const AuthorizationPopup = getComponent("authorizationPopup", true)
    return (
      <div className="auth-wrapper">
        {ranAlltest ? <span>Pass Count:{passes} Fail Count:{fails}</span> : null}
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={allOpen ? () =>{
          this.TestAll(passes, fails)} : this.AllOpen}>
          <span>{allOpen ? "Test-All" : "Open All"}</span>
        </button> 
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={onClick}>
          <span>Authorize</span>
          <svg width="20" height="20">
            <use href={ isAuthorized ? "#locked" : "#unlocked" } xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
          </svg>
        </button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
