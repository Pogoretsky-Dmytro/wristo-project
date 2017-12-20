import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import Header from '../header/header.js';
import SettingsNavbar from './wearer-navbar/navbar.js';
import WearerConfiguration from './wearer-configuration-page/wearerConfiguration.js';
import WristoConfiguration from './wristo-group-configuration/wristoGroupConfiguration.js';
import WearerError from './wearer-error.js';
import WearersLoading from './wearer-loading.js';
import WearerProfile from './wearer-profile/wearerProfile.js';
import EditWearerProfile from './wearer-profile/edit-wearer-profile/Wearer-profile.js';
import Carers from './carers-data/carers.js';
import AddWearer from './wearer-profile/addWearer.js';

import {Test} from '../../../actions/test'

import EmptyCarer from './carers-data/emptyCarer.js';
import EmptyWristo from './wristo-group-configuration/emptyWristo.js';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

class SettingsPage extends React.Component{ 

  constructor(props) {
    super(props);
    this.handleWearerData = this.handleWearerData.bind(this);
    this.getWearers = this.getWearers.bind(this);
    this.addWearer = this.addWearer.bind(this);
    this.getWearerDevice = this.getWearerDevice.bind(this);
    this.getCarers = this.getCarers.bind(this);
    this.enableWearerEdit = this.enableWearerEdit.bind(this);
    this.resetWearerEdit = this.resetWearerEdit.bind(this);
    this.updateWearer = this.updateWearer.bind(this);
    this.handleAddWearerButton = this.handleAddWearerButton.bind(this);
    this.deleteCarer = this.deleteCarer.bind(this);
    this.addCarer = this.addCarer.bind(this);
    this.discardWearerChanges = this.discardWearerChanges.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.deleteMember = this.deleteMember.bind(this);

    this.state = {
      // wearerId: null,
      activeWearerId: null,
      createdWearer: null,
      wearerData: [{'id': null, 'full_name': null, 'gender': null, 'age': null, 'heart_rate': null, 'weight':null, 'image': {'url': null}}],
      wearerGroupData: null,
      firstIdWearer: null,
      error: false, 
      wearerDevice: [],
      carers: [],

      addNewWearerClicked: false,
      wearersLoaded: false,
      emptyWearersLoaded: false,
      carersLoaded: false, 
      wearerDeviceLoaded: false,

      wearersEditing: false,
      carersEditing: false,
      wearerDeviceEditing: false,
      wearerAdded: false,
      newWearer: {'id': null, 'full_name': null, 'gender': null, 'age': null, 'heart_rate': null, 'weight':null, 'image': {'url': null}}
    }
  };




componentWillMount() {          
  this.getWearers();
  this.getCarers();
 // this.getWearerDevice();
    };



handleAddWearerButton(){

  this.setState({addNewWearerClicked: true});
  this.setState({wearerAdded: false});
}

getGroups(wearerId){
  // console.log('GETGROUPS');
  // Test.a(wearerId).then(resp => {
  //   this.setState({wearerGroupData: resp.data})
  // })

  axios({
      method: 'get',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers/${wearerId}/groups`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      responseType: 'json'
    }).then(response => {
        console.log('getGroups response', response);

        this.setState({wearerGroupData: response.data});

      }).catch((error) => { 
        console.log('getGroups error ====> ', error);

        });
}



addWearer(event){
  if(event) {
  this.setState({wearerDevice: [] })}

  console.log('addWearer');

  axios({
      method: 'post',
      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers',
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      data: {
        "wearer": {
          "full_name": event.full_name,
          "gender": event.gender,
          "age": event.age,
          "weight": event.weight,
          "heart_rate": event.heart_rate,
          "image": event.image

        }
      }
    }).then((response) => {
      debugger
      console.log('addWearer response', response);
              this.setState({addNewWearerClicked: false});
              
              // this.getWearers(response.data);
              // if(response.status==201){
              //     this.setState({wearerAdded: true})
              // }
              //this.setState({wearerId: event.id});


                let wearerArray = [];

                let wearer = {};
                
                
                this.state.wearerData.forEach(function(element){
                  wearerArray.push(Object.assign({}, element));
                });
                

                if (response.status==201) {
                  
                  Object.assign(wearer, response.data);
                  wearer.image.url = event.image;
                  // wearer.id = response.data.id;


                  wearerArray.push(wearer);
                  this.setState({
                    wearerData: wearerArray,
                    activeWearerId: response.data.id,
                    wearerAdded: true,

                  });
                  
                };


               
                console.log('addWearer wearer', wearer );
                console.log('addWearer event', event );
                console.log('addWearer response.data', response.data );
                console.log('addWearer wearerArray', wearerArray );

                

}).catch((error) => { 

        if (error.response.status === 404){
            this.setState({error: true})
        } 
        })
};

getWearers(event){

  console.log('getWearers');


  axios({
      method: 'get',
      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers',
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      responseType: 'json'
    }).then(response => {

            if (response.status === 200 && response.data.length !== 0){
              this.setState({
                wearerDeviceLoaded: true,
                wearersLoaded: true,
                firstIdWearer: response.data[0].id, 

                })
            };
            
            // let toogledWearerId;

            //     if (event !== undefined) {toogledWearerId = event.id} 
            //       else if (response.data.length !== 0) {toogledWearerId = response.data[0].id};

            
            if(response.data.length !== 0) {
              this.setState({

                // activeWearerId: toogledWearerId,
                wearerData: response.data,
              })
            }; 
            
            if(this.state.activeWearerId != null){
              this.getWearerDevice(this.state.activeWearerId);
              this.getGroups(this.state.activeWearerId);
            }
            else{
              this.getWearerDevice(this.state.firstIdWearer);
              this.getGroups(this.state.firstIdWearer);
            }

//ЧОМУ ТУ ВАЖЛИВА ПОСЛІЖОВНІСТЬ ЗАПИСУ СТЕЙТІВ wearerid i axiosdata ?????
//ЯКЩО ВКАЗАТИ СПОЧАТКУ wearerData то wearerId НЕ ЗАПИШЕТЬСЯ !?!?!?!?!?!?!?!?!?!

      }).catch((error) => { 
        console.log('getWearers error ====> ', error);

        // if (error.response.status === 404){
        //     this.setState({error: true})
        // } 
        // else this.setState({wearersLoaded: true})


  });
};

updateWearer(event){
  axios({
      method: 'put',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers/${event.id}`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      data: {
        "wearer": {
          "full_name": event.full_name,
          "gender": event.gender,
          "age": event.age,
          "weight": event.weight,
          "heart_rate": event.heart_rate,
          "image": event.image

        }
      }
    }).then(resp => {
              this.setState({addNewWearerClicked: false});
              // this.getWearers(event);
              this.setState({activeWearerId: resp.data.id});
              // this.setState({createdWearer: resp.data});

              let wearerArray = [];
              //  this.state.wearerData.forEach(function(element){
              //   if(element.id === resp.data.id){
              //    wearerArray.push(Object.assign({}, resp.data));
              //   }
              //   else wearerArray.push(Object.assign({}, element));
              //   });

              let wearer = {};
              Object.assign(wearer, event);
              wearer.image = {'url': event.image};

              if(resp.status===200){
                this.state.wearerData.forEach(function(element){
                if(element.id === event.id){
                 wearerArray.push(Object.assign({}, wearer));
                }
                else wearerArray.push(Object.assign({}, element));
                });

                // this.setState({createdWearer: event});
              }


              // let wearerIndex = this.state.wearerData.find(i => i.id === resp.data.id);
              // // wearerArray[wearerIndex] = resp.data;
              // Object.assign(wearerArray[wearerIndex], resp.data)
              console.log('updateWearer event', event );
              console.log('updateWearer resp.data', resp.data );
              console.log('updateWearer wearerArray', wearerArray );
              // console.log('updateWearer wearerArray[wearerIndex]', wearerArray[wearerIndex] );
              this.setState({wearerData: wearerArray});
             
// let groupArray = [];
//      this.props.wearerGroupData.forEach(function(element){
//         groupArray.push(Object.assign({}, element));
//       })


             }, 
             err => console.log('updateWearer error ', err)
    )
  };

updateWearerDevices(event){
  console.log('updateWearerDevices event',event);
  axios({
      method: 'put',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers/${event.id}/devices/${event.idDevice}`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      data: {
        name: event.name,
        phone_number: event.phone_number,
        status: event.status
      }
    }).then(() => {

      //this.setState({addNewWearerClicked: false});
      this.getWearerDevice(event.id)
              //this.setState({wearerId: event.id});
             }
             
).catch((error) => { 
        console.log(error);
      this.setState({error: true})
        })
  
};

deleteWearerDevices(event){

  axios({
      method: 'delete',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers/${event.id}/devices/${event.idDevice}`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
    }).then(() => {

      //this.setState({addNewWearerClicked: false});
      this.getWearerDevice(event.id)
              //this.setState({wearerId: event.id});
             }
             
).catch((error) => { 
        console.log(error);
      //  this.setState({error: true})
        })
  
};

addWearerDevices(event){

  axios({
      method: 'post',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers/${event.id}/devices`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      data: {
          name: event.name,
          phone_number: event.phone_number,
          status: event.status
      }
    }).then((response) => {
            //  this.setState({addNewWearerClicked: false});
              this.getWearerDevice(event.id);
             }
             
).catch((error) => { 
        console.log(error);
      //  this.setState({error: true})
      })
};








getWearerDevice(wearerId){
  console.log('getWearerDevice');


  axios({
      method: 'get',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/wearers/${wearerId}/devices`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      responseType: 'json'
    }).then(response => {


              this.setState({
                wearerDevice: response.data,
                // wearerDeviceLoaded: true
              })


              if(response.status === 200 && response.data.length !== 0){
              this.setState({
                wearerDeviceLoaded: true })

             }
             
}, err => console.log(err)).catch((error) => { 
        console.log(error);
        if (error.response.status == 404){
            this.setState({error: true})
        } 
        })
};

  getCarers(){
  console.log('getCarers');
  axios({
      method: 'get',
      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/carers',
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      responseType: 'json'
    }).then(response => {

          if(response.status === 200 || response.data.length !== 0){
              this.setState({
                carers: response.data,
                carersLoaded: true
              })
             };

}).catch((error) => { 
        console.log('error ====> ', error);
        if (error.response.status === 404){
            this.setState({error: true})
        } 
        });
    };



addCarer(event){
  console.log('addCarer event', event);
  axios({
      method: 'post',
      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/carers',
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      data: {
        "carer": {
          "first_name": event.first_name,
          "last_name": event.last_name,
          "email": event.email,
          "age": event.age,
          "password": event.password,
          "password_confirmation": event.password

        }
      }
    }).then((response) => {


                this.getCarers();
              
             }
             
).catch((error) => { 
        console.log('addCarer error.response.status ====> ', error.response.status);
        if (error.response.status === 404){
            this.setState({error: true})
        } else this.getCarers();

        })
};


deleteCarer(event){
  console.log('deleteCarer');
  axios({
      method: 'delete',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/carers/${event}`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      responseType: 'json'
    }).then(response => {

            this.getCarers();
      
            })
    // .catch((error) => { 
    //       console.log(error);
    //       if (error.response.status === 404){
    //         this.setState({error: true})
    //     } 
    //       });
      };

deleteMember(group, wearerId){

    console.log('deleteMember group = ', group);
    console.log('deleteMember wearerId = ', wearerId);

    axios({
      method: 'delete',
      url: `https://wristo-platform-backend-stg.herokuapp.com/api/v1/groups/${group.id}/wearers/${wearerId}`,
      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
      'uid': 'boretskairuna23@gmail.com', 'client': 'dcap6lWaoLUnnrqp3e0BXA', 'access-token': 'JMQEZxa7-QZogK6lzJ-tog'},
      responseType: 'json'
    }).then(response => {
        console.log('getGroups response', response);
        console.log('getGroups wearerId', wearerId);

        if (response.status === 200){
          let groupArray = [];
          this.state.wearerGroupData.forEach(function(element){
            if(element.id !== group.id){
              groupArray.push(Object.assign({}, element));
            }
            
          })
        this.setState({wearerGroupData: groupArray});
        }
        //this.getGroups(wearerId);

      }).catch((error) => { 
        console.log('getGroups error ====> ', error);

        })
}



  handleWearerData(event) {

    this.setState({addNewWearerClicked: false});
    this.setState({wearerId: event});
    this.setState({activeWearerId: event});
    this.setState({createdWearer: null});
   //this.getWearerDevice(event);
  };



  enableWearerEdit(){
    this.setState({wearersEditing: true});
    this.setState({addNewWearerClicked: false});
    // console.log('enableWearerEdit this.state.wearersEditing', this.state.wearersEditing);
  };

  discardWearerChanges(){
    this.setState({wearersEditing: false});
    this.setState({addNewWearerClicked: false});
  }

 resetWearerEdit(){
    this.setState({wearersEditing: false});
    console.log('enableWearerEdit this.state.wearersEditing', this.state.wearersEditing);
  };

    render(){
      let wearersDataForChildren;

      if(this.state.wearerData[0].id != null){
        const firstWearer = this.state.wearerData.find(i => i.id === this.state.firstIdWearer);
        const activeWearer = this.state.wearerData.find(i => i.id === this.state.activeWearerId);


     

          if(this.state.activeWearerId === null && this.state.firstIdWearer === null) {
            wearersDataForChildren = this.state.newWearer;
          } 
          else if (this.state.activeWearerId === null && this.state.firstIdWearer !== null) {
            wearersDataForChildren = firstWearer;
          }
          else if (this.state.createdWearer != null){
            wearersDataForChildren = this.state.createdWearer;
          }
          else wearersDataForChildren = activeWearer;
     


      console.log('wearerSettingPage this.state.wearerData', this.state.wearerData);
      console.log('wearerSettingPage this.state.createdWearer', this.state.createdWearer);
      console.log('wearerSettingPage firstWearer', firstWearer);
      console.log('wearerSettingPage activeWearer', activeWearer);

      }

      else {
        wearersDataForChildren = this.state.newWearer
      }


      
       

      
     
// wearerId = {this.state.wearerId}
// wearerId = {this.state.wearerId}

    return (
          <div>
          <Header/>
          <div>
              <div className="contentWrap">
                  {
                    this.state.error ? <WearerError />
                    :
                    this.state.wearersLoaded ?
                    <SettingsNavbar getGroups = {this.getGroups} wearersData = {this.state.wearerData} handleWearerData={this.handleWearerData} handleAddWearerButton={this.handleAddWearerButton} getWearers = {this.getWearers} getWearerDevice={this.getWearerDevice} activeWearerId = {this.state.activeWearerId} resetWearerEdit = {this.resetWearerEdit} wearerAdded = {this.state.wearerAdded}/>
                    :
                    <WearersLoading/> 
                  }

                

              <div className="wearerConfigWrap">
                    <p className="wearerConfigWrap__name">Configuration Page</p>
                    <p className="wearerConfigWrap__description">Manage information about wristo</p>
                    {
                    this.state.error ? <WearerError />
                    :

                    this.state.wearersLoaded ?
                    
                    this.state.addNewWearerClicked ?
                      <AddWearer data = {this.state.newWearer} discardWearerChanges = {this.discardWearerChanges} addWearer = {this.addWearer} />
                      :
                      this.state.wearersEditing ? 
                      <EditWearerProfile deleteMember = {this.deleteMember} wearerGroupData = {this.state.wearerGroupData} data = {wearersDataForChildren} discardWearerChanges = {this.discardWearerChanges} updateWearer = {this.updateWearer} getWearers = {this.getWearers}/> 
                      :
                      <WearerProfile wearerGroupData = {this.state.wearerGroupData} getGroups = {this.getGroups} wearersData = {wearersDataForChildren}  enableWearerEdit = {this.enableWearerEdit}/>
                    
                    :
                    <WearersLoading/> 
                    }

                  
                  {
                    this.state.error ? <WearerError />
                    :
                    this.state.wearerDeviceLoaded ?

                    <WristoConfiguration addNewWearerClicked={this.state.addNewWearerClicked} firstIdWearer = {this.state.firstIdWearer} getWearerDevice = {this.getWearerDevice} updateWearerDevices ={this.updateWearerDevices} deleteWearerDevices = {this.deleteWearerDevices} addWearerDevices={this.addWearerDevices} wearerID = {this.state.activeWearerId} wearerDeviceData = {this.state.wearerDevice} error = {this.state.error} />
                    :
                    <WearersLoading/>
                  }
                  
                  {
                    this.state.error ? <WearerError />
                    :
                    this.state.carersLoaded ?
                    
                    <Carers carers = {this.state.carers} error = {this.state.error} deleteCarer = {this.deleteCarer} addCarer = {this.addCarer} addNewWearerClicked = {this.state.addNewWearerClicked}/>
                    :
                    <WearersLoading/>                 
                  }



              </div>

            
            </div>
           </div> 
        </div>
        );
    }
}



export default SettingsPage;

