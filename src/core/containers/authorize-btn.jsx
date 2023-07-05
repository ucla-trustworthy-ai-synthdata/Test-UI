import React from "react"
import PropTypes from "prop-types"

export default class AuthorizeBtnContainer extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render () {
    const { authActions, authSelectors, specSelectors, getComponent} = this.props
    
    const securityDefinitions = specSelectors.securityDefinitions()
    const authorizableDefinitions = authSelectors.definitionsToAuthorize()

    const AuthorizeBtn = getComponent("authorizeBtn")
    let login = localStorage.getItem("authorized")
    if (login !='{}' && !authSelectors.authorized().size){
      let key = authorizableDefinitions.get(0).keys().next().value
      let scheme = authorizableDefinitions.get(0).get(key)
      let password = JSON.parse(login)[key]
      if (password)
        authActions.authorizeWithPersistOption({[key]:{"name": key, "schema": scheme, "value": password["value"]}})
    }

    return securityDefinitions ? (
      <AuthorizeBtn
        onClick={() => authActions.showDefinitions(authorizableDefinitions)}
        isAuthorized={!!authSelectors.authorized().size}
        showPopup={!!authSelectors.shownDefinitions()}
        getComponent={getComponent}
      />
    ) : null
  }
}
