import React from 'react';
import HostConfigRow from './HostConfigRow.jsx'


export class HostConfig extends React.Component {

  constructor(args) {
    super(args)      // наполняю this от Page

    this.state = {
      groupList:        [],
      inputHostName:    this.props.inputHostName || '',
      selectHostGroup:  this.props.selectHostGroup || '',
      showResult:       true,
      searchResult:     null
    }

    this.handleChangeInput    = this.handleChangeInput.bind(this)
    this.handleChangeSelect   = this.handleChangeSelect.bind(this)
    this.handleClkShowResult  = this.handleClkShowResult.bind(this)
    this.handleClkAction      = this.handleClkAction.bind(this)

    this.apiCmd = {
      token:      window.localStorage.getItem('token'),
      get:        'host_get',
      post:       'host_post',
      put:        'host_put',
      del:        'host_del',
      getGroups:  'hostgroup_get'
    }




    // API actions ----------------------------------------
    this.hostAdd = () => {
      this.props.swgClient.apis.Configuration[this.apiCmd.post]({token: this.apiCmd.token, body: {dns: this.state.inputHostName, groupid: parseInt(this.state.selectHostGroup)} })
      .then((res) => {
        this.hostSearch()
      })
      .catch((err) => {
        // err
      })
    }

    this.hostSearch = () => {
      var searchResultTemplate = []

      this.props.swgClient.apis.Configuration[this.apiCmd.get]({token: this.apiCmd.token, name: this.state.inputHostName, group: this.state.selectHostGroup})
      .then((res) => {

        res.body.map( (row, i) => {
          searchResultTemplate.push(<HostConfigRow {...{Win: this}} row={row} key={i}/>)
        })

        this.setState({searchResult: searchResultTemplate, showResult: true})
      })
      .catch((err) => {
        // err
      })
    }





    // Select oprions -------------------------------------
    this.props.swgClient.apis.Configuration[this.apiCmd.getGroups]({token: this.apiCmd.token, name: '' })
    .then((res) => {
      this.setState({groupList: res.body})
    })
    .catch((err) => {
      // err
    })

  }





  handleChangeInput(event) {
    this.setState({inputHostName: event.target.value})
  }

  handleChangeSelect(event) {
    this.setState({selectHostGroup: event.target.value})
  }

  handleClkShowResult(event) {
    this.setState({showResult: !this.state.showResult})
  }

  handleClkAction(event) {
    switch (true) {

      case (event.target.value === 'search'):
        this.hostSearch()
        break

      case (event.target.value === 'add'):
        this.hostAdd()
        break

      default:
        console.log('default')
        break

    }

  }



  render() {
    console.log('HostConfig render')

    var finalTemplate =
    <div className='host-config-win'>
      <div className='std-item-header' onClick={this.handleClkShowResult}>HostConfig</div>

      <input type='text' placeholder='DNS or IP' value={this.state.inputHostName} onChange={this.handleChangeInput} />
      <select size='1' value={this.state.selectHostGroup} onChange={this.handleChangeSelect}>
        <option value='' value=''>- select group -</option>
        {
          this.state.groupList.map((row,i) =>
            <option key={i} value={row.groupid}>{row.name}</option>
          )
        }
      </select>
      <br />
      <button className='get-bttn' onClick={this.handleClkAction} value='search'>Найти</button>
      <button className='add-bttn' onClick={this.handleClkAction} value='add'>Добавить</button>

      <div className={this.state.showResult ? '' : 'display-none'}>{this.state.searchResult}</div>

    </div>

    return finalTemplate
  }

}
