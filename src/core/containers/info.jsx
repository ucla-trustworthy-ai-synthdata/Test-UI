import React from "react"
import PropTypes from "prop-types"
import { resetInstances } from "../components/execute"
import { resetToggleInstances } from "../components/operation-summary"
import { resetAlltest } from "../components/auth/authorize-btn"

export let currentURL;
export default class InfoContainer extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    oas3Selectors: PropTypes.func.isRequired,
  }
  componentDidMount(){
    if(!currentURL){
      currentURL = this.props.specSelectors.url()
    }
    else if(currentURL != this.props.specSelectors.url()){
      resetAlltest()
      resetInstances()
      resetToggleInstances()
      currentURL = this.props.specSelectors.url()
    }
  }


  render () {
    const {specSelectors, getComponent, oas3Selectors} = this.props

    const info = specSelectors.info()
    const url = specSelectors.url()
    const basePath = specSelectors.basePath()
    const host = specSelectors.host()
    const externalDocs = specSelectors.externalDocs()
    const selectedServer = oas3Selectors.selectedServer()

    const Info = getComponent("info")

    
    return (
      <div>
        {info && info.count() ? (
          <Info info={info} url={url} host={host} basePath={basePath} externalDocs={externalDocs}
                getComponent={getComponent} selectedServer={selectedServer} />
        ) : null}
      </div>
    )
  }
}
