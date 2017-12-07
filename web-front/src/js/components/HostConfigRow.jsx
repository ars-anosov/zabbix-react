import React from 'react'


export default class HostConfigRow extends React.Component {
  
  constructor(args) {
    super(args)      // наполняю this от Win

    this.state = {
      description:  this.props.row.description || '',
      notes:  this.props.row.inventory.notes || '{}',
      showResult:       false,
      showModNote:      false
    }

    this.handleChangeTextDesc   = this.handleChangeTextDesc.bind(this)
    this.handleChangeTextNotes  = this.handleChangeTextNotes.bind(this)
    this.handleClkShowResult    = this.handleClkShowResult.bind(this)
    this.handleClkAction        = this.handleClkAction.bind(this)

  }




  handleClkShowResult(event) {
    
    // Если результат скрыт, запрашиваем новые занчения
    if (!this.state.showResult) {
      this.props.Win.props.swgClient.apis.Configuration[this.props.Win.apiCmd.get]({
        token: this.props.Win.apiCmd.token,
        name: this.props.row.host
      })
      .then((res) => {
        this.setState({description: res.body[0].description, notes: res.body[0].inventory.notes})
      })
    }
    
    // Показываем/скрываем результат
    this.setState({showResult: !this.state.showResult})
  }

  handleClkAction(event) {
    switch (true) {

      case (event.target.value === 'del'):
        
        var confAnswer=window.confirm("Delete?")
        if (confAnswer) {
          this.props.Win.props.swgClient.apis.Configuration[this.props.Win.apiCmd.del]({
            token: this.props.Win.apiCmd.token,
            hostid: this.props.row.hostid
          })
          .then((res) => {
            this.props.Win.hostSearch()
          })
        }

        break

      case (event.target.value === 'mod'):
        
        var notesObj = false

        console.log(this.state.notes)
        
        try {
          notesObj = JSON.parse(this.state.notes)
        } catch (e) {
          alert('inventory.notes Must be JSON object!')
        }

        if (notesObj) {
          this.props.Win.props.swgClient.apis.Configuration[this.props.Win.apiCmd.put]({
            token: this.props.Win.apiCmd.token,
            hostid: this.props.row.hostid,
            body: {
              description: this.state.description,
              inventory: {
                notes: this.state.notes
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

        break

      default:
        console.log('default')
        break

    }

  }




  handleChangeTextDesc(event) {
    this.setState({description: event.target.value})
  }

  handleChangeTextNotes(event) {
    this.setState({notes: event.target.value})
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
      <div className='std-item-header-small' onClick={this.handleClkShowResult}>
        {row.host} <strong className={this.state.showModNote ? 'mod-bttn' : 'display-none'}> Изменено </strong>
      </div>
      <div className='host-config-item-menu'>group: {hGroups}</div>
      <div className={this.state.showResult ? 'host-config-item-menu' : 'display-none'}>
        {/* templates: {hTemplates} */}
        {/* interfaces: {hInterfaces} */}
        
        inventory.notes (JSON):<br /><textarea className='host-config-textarea' value={this.state.notes} onChange={this.handleChangeTextNotes}></textarea><br />
        description:<br /><textarea className='host-config-textarea-small' value={this.state.description} onChange={this.handleChangeTextDesc}></textarea><br />
        <button className='del-bttn' onClick={this.handleClkAction} value='del'>Удалить</button>&nbsp;
        <button className='mod-bttn' onClick={this.handleClkAction} value='mod'>Изменить</button>
      </div>
    </div>

    return finalTemplate
  }

}