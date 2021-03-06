import React, { Component } from 'react';
import './reminder.scss';
//import './groups/groups.scss';
import Header from "../settings/wearer-settings/header/header";
import userImage from "../assets/icons/person.svg";
import Calendar from './calendar';
import axios from 'axios';
import group from '../assets/icons/group.svg';
import {master} from "../login/loginForm.js"
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import WearersLoading from '../settings/wearer-settings/wearers-configuration-page/wearer-loading.js';

/*commit in other*/
let reminders = [];

class Reminder extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		cmbbox: "all users",
  		groups: [],
  		groupid: 0,
  		wearershow: "all users",
  		search: 0,
			filteredreminders: [],
			redirectToLogin: null,
      accesstoken: null,
      uid: null,
      client: null
  	}
  	this.changeWearer = this.changeWearer.bind(this);
  	this.onGroupClick = this.onGroupClick.bind(this);
  	this.getWearers = this.getWearers.bind(this);
  	this.switchwearer = this.switchwearer.bind(this);
  	this.getReminders = this.getReminders.bind(this);
  	this.createreminder = this.createreminder.bind(this);
		this.chooseevent = this.chooseevent.bind(this);
	  this.redirectToLogin = this.redirectToLogin.bind(this);
}


addGroup(item){
	let color = "#f5f5f5";
	if(item.id == this.state.groupid) color = "#d2d2d2"; 
	return <div className="group" style={{backgroundColor: color}} onClick={() => this.onGroupClick(item.id)}>
			<div className="groupbutton"><img src={group} alt="" />
			<p>{item.name}</p></div>
		</div>
}
switchwearer(item){
	this.state.wearershow = item.id;
	this.changeWearer(item);
}
onGroupClick(id){
	this.setState({groupid: id});
	this.getWearers(id);
}
changeWearer(item){
	this.setState({cmbbox: item.full_name});
}
getWearers(id){
	this.state.wearers = [];
	axios({
	      method: 'get',
	      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/groups/' + id + '/wearers',
	      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': sessionStorage.getItem("uid"), 'client': sessionStorage.getItem("client"), 'access-token': sessionStorage.getItem("accesstoken")},
	      responseType: 'json'
	   	}).then(response => {
	   		this.setState({wearers: response.data});
	    }).then(response => {
	    }).catch((error) => { 
	        console.log(error);
	    });
}
componentWillMount(){
	if( master.accesstoken !== null && master.uid !== null && master.client !== null){
		this.setState({
			accesstoken: master.accesstoken,
			uid: master.uid,
			client: master.client
		})  
		} 

}
componentDidMount(){
	axios({
		method: 'get',
		url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/groups',
		headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
 'uid': sessionStorage.getItem("uid"), 'client': sessionStorage.getItem("client"), 'access-token': sessionStorage.getItem("accesstoken")},
		responseType: 'json'
	 }).then(response => {
		if(response.status == 200){
			this.setState({
				redirectToLogin: false
			})
		}
		 this.setState({groups:  response.data});
		 return response.data;
	}, error => { 
		console.log(error.response);
		if(error.response.status === 401){
				this.setState({
					redirectToLogin: true
				})
		}
		this.setState({error: true})


	}).then(response => {
		this.state.groupid = response[0].id;
		this.getWearers(this.state.groupid)
	}, error => { 
		console.log(error.response);
		if(error.response.status === 401){
				this.setState({
					redirectToLogin: true
				})
		}
		this.setState({error: true})


	}).then(response => {

		this.getReminders()
	}, error => { 
		this.setState({error: true})
	});

		if(this.state.groupid) this.getReminders();
}

getReminders(){
		axios({
	      method: 'get',
	      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/groups/'+this.state.groupid+'/reminders',
	      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
     	 'uid': sessionStorage.getItem("uid"), 'client': sessionStorage.getItem("client"), 'access-token': sessionStorage.getItem("accesstoken")},
	      responseType: 'json'
	   	}).then(response => {
				if(response.status == 200){
					this.setState({
						redirectToLogin: false
					})
				}
	   		this.state.reminders = response.data;
	    }, error => { 
				console.log("error", error);
				if(error.response.status === 401){
					this.setState({
						redirectToLogin: true
					})
			}
		})
}

findreminder(){
	let find, rem;
	find = this.refs.reminder.value;
	rem = this.state.reminders.filter(item => {
		return item.title.toLowerCase().indexOf(find.toLowerCase()) !== -1;})
	this.setState({filteredreminders: rem});
}
createreminder(item){
	return <li onMouseOver={(e) => this.chooseevent}>{item.title}</li>
}
chooseevent(e){
	//console.log("hello");
}

redirectToLogin() {          
	if( this.state.client == null && this.state.accesstoken == null && this.state.uid == null){
		this.setState({
			redirectToLogin: true
		})
	}
	};

render(){
	let listOfGroups = this.state.groups.map(this.addGroup.bind(this))
	let listWearers, createreminders = [];
  	if(this.state.wearers)listWearers = this.state.wearers.map((item) => {
  		return <li onClick={(e) => this.switchwearer(item, e)} key={item.id}>{item.full_name}</li>
  	});
  	this.state.filteredreminders ? createreminders = this.state.filteredreminders.map(this.createreminder) : createreminders = this.state.reminders.map(this.createreminder)
	return(
		<div>{
			this.state.redirectToLogin ?  <Redirect to={{
				pathname: '/'
			}}/> : this.state.redirectToLogin === false ? 		<div className="reminders">
			<Header redirectToLogin = {this.redirectToLogin} />
				<div className="switch-wearers">
					<div className="add-group">
						{listOfGroups}
					</div>
					<div>
						<div className="user-image"><img src={userImage}/></div>
						<div className="combobox">
							<button className="dropbtn">{this.state.cmbbox}</button>
							<ul className="dropdown-content">
							<li key="" onClick={(e) => this.switchwearer({full_name: "all users", id: 0}, e)} >
							All users</li>{listWearers}</ul>
						</div>
						<div className="search">
								<input placeholder="Search" className="input" ref="reminder" onChange={this.findreminder.bind(this)}/>
								<ul className="reminderslist">
								{createreminders}
								</ul>
						</div>
					</div>
				</div>
	
				<div className="reminders-table">
					<Calendar wearers={this.state.wearers} search={this.state.filteredreminders} id={this.state.groupid} wearershow={this.state.wearershow} filter={this.state.search}/>
				</div>
			</div> :
			<WearersLoading/> 
		} 

		</div>
	)
}
}

export default Reminder;