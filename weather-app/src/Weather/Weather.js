import React, { Component } from 'react';
import classes from './Weather.module.css'
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BounceLoader} from 'react-spinners'
import axios from 'axios'
import ShowWeather from '../ShowWeather/ShowWeather'
// import Button from '../Button/Button'
class WeatherForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat:null,
            lon:1,
            date:null,
            temp:null,
            feelsLike:null,
            humidity:null,
            request_complete:false,
            showSpinner:false,
            showError:false
    };
    this.getLocation = this.getLocation.bind(this);
    }
    getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates);
        }alert("Geolocation is not supported by this browser")
    }
    getCoordinates(position){
        this.setState({
            lat: position.coords.latitude === undefined ?30.0444 :position.coords.latitude,
            lon: position.coords.longitude === undefined ?31.2357:position.coords.longitude
         }) 
    }


    


    
    // calls weather data
    getWeatherHandler(){
        this.setState({
            request_complete:false
        })
        axios.get('http://localhost:3000/weather',{
            params:{
                lat : this.state.lat,
                lon : this.state.lon,
                dt :this.state.date,
            }
         
        }).then(response => {
           
            this.setState({
                temp:response.data.current.temp, 
                feelsLike:response.data.current.feels_like,
                humidity:response.data.current.humidity,
                request_complete:true,
                showSpinner:false

            })
 
        }).catch(()=>{
            this.setState({
                showError:true,
                showSpinner:false
            
            })
        })
        this.setState({
            showSpinner:true
        })
     
        
    
}

    //passes date in time stamp form to the state 
    passDate(event){
      let time =  new Date(event.target.value);
      let epoch = time.getTime()/1000;
      this.setState({
          date:epoch,
      })
  
    }   
    
    
    
    
    render() { 
        let weather = null
        if (this.state.request_complete){
         weather = <ShowWeather 
            temp={this.state.temp}
            feel={this.state.feelsLike}
            humidity={this.state.humidity}
            className={classes.main}
            />
        }
        let error = null
        if(this.state.showError === true ){
        error = <p>Please enter a date within five days</p>
        }
        
       let  spinner=null
        if(this.state.showSpinner){
            spinner = <BounceLoader className={classes.main}/>
        }
    
        return (
            <div className={classes.main} >
                <div>
                <h1 >Get Weather history for your location</h1>
                <p className={classes.grey}>please allow location in order to get accurate weather condition data</p>
                </div>
                <form className={classes.main}>
                    <input type="date" onChange={(event) => this.passDate(event)} />
                <div className={classes.Button} onClick={this.getWeatherHandler.bind(this)}>Get Weather</div>
                </form>
                {error}
                {spinner}
                {weather}
            </div>
          );
    }
}
 
export default WeatherForm;