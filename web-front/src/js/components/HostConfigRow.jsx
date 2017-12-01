import React from 'react'


export default class HostConfigRow extends React.Component {
  
  constructor(args) {
    super(args)      // наполняю this от Win

    this.state = {
      showMenu:     false,
      showModNote:  false
    }

    this.onBtnClkShowMenu = (btnArg) => {
      this.setState({showMenu: !this.state.showMenu})
    }

    this.onBtnClkMenuAction = (btnArg) => {
      if (btnArg === 'del') {
        
        var confAnswer=window.confirm("Delete?")
        if (confAnswer) {
          this.props.Win.props.swgClient.apis.Configuration[this.props.Win.apiCmd.del]({
            token: this.props.Win.apiCmd.token,
            hostid: this.props.row.hostid
          })
          .then((res) => {
            this.props.Win.searchResultSetState()
          })
        }

      }

      if (btnArg === 'mod') {

        var notesObj = false
        try {
          notesObj = JSON.parse(this.refs.inventoryNotes.value)
        } catch (e) {
          alert('inventory.notes Must be JSON object!')
        }

        if (notesObj) {
          this.props.Win.props.swgClient.apis.Configuration[this.props.Win.apiCmd.put]({
            token: this.props.Win.apiCmd.token,
            hostid: this.props.row.hostid,
            body: {
              description: this.refs.description.value,
              inventory: {
                notes: this.refs.inventoryNotes.value
              }
            }
          })
          .then((res) => {
            this.setState({showModNote: true})
            setTimeout(() => {
              this.setState({showModNote: false})
            }, 500)
          })
        }

      }

    }

  }




  render() {
    console.log('render HostConfigRow')
    var finalTemplate = null
    
    let row = this.props.row
    let hGroups = ''
    row.groups.map( (rowGroup, i)             => { hGroups = hGroups + '"'+rowGroup.name+'" ' } )
    let hTemplates = ''
    row.parentTemplates.map( (rowTemplate, i) => { hTemplates = hTemplates + '"'+rowTemplate.name+'" ' } )
    let hInterfaces = ''
    row.interfaces.map( (rowInterface, i)     => {
      if (rowInterface.useip === 1)   { hInterfaces = hInterfaces + '"'+rowInterface.ip+':'+rowInterface.port+'" ' }
      else                            { hInterfaces = hInterfaces + '"'+rowInterface.dns+':'+rowInterface.port+'" ' }
    } )

    finalTemplate =
    <div className='host-config-item'>
      <div className='std-item-header-small' onClick={()=>this.onBtnClkShowMenu()}>
        {row.host} <strong className={this.state.showModNote ? 'mod-bttn' : 'display-none'}> Изменено </strong>
      </div>
      <div className='host-config-item-menu'>group: {hGroups}</div>
      <div className={this.state.showMenu ? 'host-config-item-menu' : 'display-none'}>
        {/* templates: {hTemplates} */}
        {/* interfaces: {hInterfaces} */}
        
        inventory.notes (JSON):<br /><textarea className='host-config-textarea' ref='inventoryNotes' defaultValue={row.inventory.notes ? row.inventory.notes : '{}'}></textarea><br />
        description:<br /><textarea className='host-config-textarea-small' ref='description' defaultValue={row.description}></textarea><br />
        <button className='del-bttn' onClick={()=>this.onBtnClkMenuAction('del')}>Удалить</button>&nbsp;
        <button className='mod-bttn' onClick={()=>this.onBtnClkMenuAction('mod')}>Изменить</button>
      </div>
    </div>

    return finalTemplate
  }

}