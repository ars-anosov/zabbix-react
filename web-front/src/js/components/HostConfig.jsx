import React from 'react';
import HostConfigRow from './HostConfigRow.jsx'


export class HostConfig extends React.Component {

  constructor(args) {
    super(args)      // наполняю this от Page

    this.state = {
      searchResult: null,
      groupList: {},
      showResult: true
    }

    this.apiCmd = {
      token: window.localStorage.getItem('token'),
      get:        'host_get',
      post:       'host_post',
      put:        'host_put',
      del:        'host_del',
      getGroups:  'hostgroup_get'
    }



    this.onBtnClkShowResult = (btnArg) => {
      this.setState({showResult: !this.state.showResult})
    }

    this.groupListSetState = () => {
      var groupList = {}

      this.props.swgClient.apis.Configuration[this.apiCmd.getGroups]({token: this.apiCmd.token, name: '' })
      .then((res) => {

        res.body.map( (row, i) => {
          groupList[row.groupid] = {groupid: row.groupid, name: row.name}
        })

        this.setState({groupList: groupList})

      })
      .catch((err) => {
        // err
      })
    }

    this.hostAddSetState = () => {
      var selIdx  = this.refs.hostGroup.options.selectedIndex

      this.props.swgClient.apis.Configuration[this.apiCmd.post]({token: this.apiCmd.token, body: {dns: this.refs.hostName.value, groupid: parseInt(this.refs.hostGroup.options[selIdx].value)} })
      .then((res) => {
        this.searchResultSetState()
      })
    }

    this.searchResultSetState = () => {
      var selIdx  = this.refs.hostGroup.options.selectedIndex
      var searchResultTemplate = []

      this.props.swgClient.apis.Configuration[this.apiCmd.get]({token: this.apiCmd.token, name: this.refs.hostName.value, group: this.refs.hostGroup.options[selIdx].value})
      .then((res) => {

        res.body.map( (row, i) => {
          searchResultTemplate.push(<HostConfigRow {...{Win: this}} row={row} key={i +'-'+ row.hostid}/>)
        })

        this.setState({searchResult: searchResultTemplate, showResult: true})
      })
      .catch((err) => {
        // err
      })
    }




    this.apiRequest = (btnArg) => {
      switch (true) {

        case (btnArg === 'search'):
          this.searchResultSetState()
          break

        case (btnArg === 'add'):
          this.hostAddSetState()
          break

        default:
          console.log('default')
          break

      }
    }




    this.groupListSetState()

  }




  render() {
    console.log('HostConfig render')

    var finalTemplate =
    <div className='host-config-win'>
      <div className='std-item-header' onClick={()=>this.onBtnClkShowResult()}>HostConfig</div>

      <input
        type='text'      
        defaultValue=''
        placeholder='DNS or IP'
        ref='hostName'
      />
      <select size='1' ref='hostGroup'>
        <option defaultValue='' value=''>Host group</option>
        {
          Object.keys(this.state.groupList).map((row,i) =>
            <option key={i} value={row}>{this.state.groupList[row].name}</option>
          )
        }
      </select>
      <br />
      <button className='get-bttn' onClick={()=>this.apiRequest('search')}>Найти</button>
      <button className='add-bttn' onClick={()=>this.apiRequest('add')}>Добавить</button>

      <div className={this.state.showResult ? '' : 'display-none'}>{this.state.searchResult}</div>

    </div>

    return finalTemplate
  }

}
