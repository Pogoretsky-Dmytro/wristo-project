import React, { Component } from 'react';
import './groups.scss';
import group from '../../assets/icons/group.svg'
import adduser from '../../assets/icons/add.svg'

const DropDownMenu = (props) => {
	return <ul className="dropdown">
		<li onClick={() => props.onListClick("rename", props.item)}>rename</li>
		<li onClick={() => props.onListClick("duplicate", props.item)}>duplicate</li>
		<li onClick={() => props.onListClick("delete", props.item)}>delete</li>
	</ul>
}

export default class AddGroup extends React.Component{
	constructor(props){
		super(props);;
		this.state = {
			hover: ""
		}
	}
	addGroup(item){
		return <div key={item.id + 1} className="group" style={{backgroundColor: item.id == this.props.active ? "#d2d2d2" : "transparent"}} onClick={() => this.props.onGroupClick(item)}>
			<div className="groupbutton"><img src={group} alt="" />
			<p>{item.name}</p></div>
			<DropDownMenu onListClick={this.props.onListClick} item={item}/>
		</div>
	}
	render(){
		let listOfGroups = this.props.groups.map(this.addGroup.bind(this))
		return <div className="add-group">
			{listOfGroups}
			<div className="addnwegroup" onClick={() => this.props.onListClick("new")}>
				<img src={adduser} alt="" />
				<p>Add New</p>
			</div>
	</div>
	}
}