import React, { Component } from 'react';
import classes from './Weather.module.css'
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BounceLoader} from 'react-spinners'
import axios from 'axios'
import ShowWeather from '../ShowWeather/ShowWeather'
// import Button from '../Button/Button'
class WeatherForm extends Component {
    state = {
            lat:null,
            lon:1,
            date:null,
            temp:null,
            feelsLike:null,
            humidity:null,
            request_complete:false,
            showSpinner:false,
            showError:false
    }
    constructor (props){
        super(props)
        this.state = {
            date: new Date()
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
          (position) => {
             this.setState({
                lat: position.coords.latitude === undefined ?30.0444 :position.coords.latitude,
                lon: position.coords.longitude === undefined ?31.2357:position.coords.longitude
             }) 

          },
          (error) => {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
      }
    // calls weather data
    getWeatherHandler(){
        if ( this.state.showError === false)
        {
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
        })
        this.setState({
            showSpinner:true
        })
     
        
    }
}

    //passes date in time stamp form to the state 
    passDate(event){
      let currentTime = new Date();
      let epochCurrentTime = currentTime.getTime()/1000
      let time =  new Date(event.target.value);
      let epoch = time.getTime()/1000
      if (epochCurrentTime-epoch > 432000 ){
            this.setState({
                showError:true
            })
      } 
      if ( epochCurrentTime-epoch < 0 ) {
        console.log('nothing')
        this.setState({
            showError:true
          
        })
      }
      this.setState({
          date:epoch,
          showError:false
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