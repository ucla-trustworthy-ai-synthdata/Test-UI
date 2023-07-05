import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import toString from "lodash/toString"


export let toggleInstances = []

export const resetToggleInstances = () =>{
  while (toggleInstances.length)
    toggleInstances.pop()
}

export default class OperationSummary extends PureComponent {

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    isShown: PropTypes.bool.isRequired,
    toggleShown: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
    toggle: PropTypes.func
  }

  static defaultProps = {
    operationProps: null,
    specPath: List(),
    summary: ""
  }

  constructor(){
    super()
    this.Shown = null
    toggleInstances.push(this)
  }

  isShown(){
    return this.Shown
  }

  Toggle(){
    let {toggleShown} = this.props
    toggleShown()
    this.Shown = !this.Shown
  }
  render() {

    let {
      isShown,
      toggleShown,
      getComponent,
      authActions,
      authSelectors,
      operationProps,
      specPath,
    } = this.props

    if (this.Shown == null)
      this.Shown = isShown
    let {
      summary,
      isAuthorized,
      method,
      op,
      showSummary,
      path,
      operationId,
      originalOperationId,
      displayOperationId,
    } = operationProps.toJS()

    let {
      summary: resolvedSummary,
    } = op

    let security = operationProps.get("security")

    const AuthorizeOperationBtn = getComponent("authorizeOperationBtn")
    const OperationSummaryMethod = getComponent("OperationSummaryMethod")
    const OperationSummaryPath = getComponent("OperationSummaryPath")
    const JumpToPath = getComponent("JumpToPath", true)
    const CopyToClipboardBtn = getComponent("CopyToClipboardBtn", true)

    const hasSecurity = security && !!security.count()
    const securityIsOptional = hasSecurity && security.size === 1 && security.first().isEmpty()
    const allowAnonymous = !hasSecurity || securityIsOptional
    return (
      <div className={`opblock-summary opblock-summary-${method}`} >
        <button
          aria-label={`${method} ${path.replace(/\//g, "\u200b/")}`}
          aria-expanded={isShown}
          className="opblock-summary-control"
          onClick={() => this.Toggle(toggleShown)}
        >
          <OperationSummaryMethod method={method} />
          <OperationSummaryPath getComponent={getComponent} operationProps={operationProps} specPath={specPath} />

          {!showSummary ? null :
            <div className="opblock-summary-description">
              {toString(resolvedSummary || summary)}
            </div>
          }

          {displayOperationId && (originalOperationId || operationId) ? <span className="opblock-summary-operation-id">{originalOperationId || operationId}</span> : null}

          <svg className="arrow" width="20" height="20" aria-hidden="true" focusable="false">
            <use href={isShown ? "#large-arrow-up" : "#large-arrow-down"} xlinkHref={isShown ? "#large-arrow-up" : "#large-arrow-down"} />
          </svg>
        </button>

        {
          allowAnonymous ? null :
            <AuthorizeOperationBtn
              isAuthorized={isAuthorized}
              onClick={() => {
                const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                authActions.showDefinitions(applicableDefinitions)
              }}
            />
        }
        <CopyToClipboardBtn textToCopy={`${specPath.get(1)}`} />
        <JumpToPath path={specPath} />{/* TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}
      </div>
    )

  }
}
