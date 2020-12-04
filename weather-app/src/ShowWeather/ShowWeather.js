import classes from './ShowWeather.module.css'

const ShowWeather = (props) => {


    return (

        <div className={classes.weather_card}>
            <h1>Tempreture: {Math.floor(props.temp-273)}C</h1>
            <p>Feels like: {Math.floor(props.feel-273)}C</p>
            <p>Humidity: {props.humidity}</p>
        </div>


      );
    

}
 
export default ShowWeather;