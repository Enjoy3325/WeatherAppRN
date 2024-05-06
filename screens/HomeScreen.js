import {
	View,
	Text,
	SafeAreaView,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import * as Progress from "react-native-progress";
import bacgraundImage from "../assets/images/bg.webp";
import wind from "../assets/icons/wind.png";
import drop from "../assets/icons/drop.png";
import sun from "../assets/icons/sun.png";
import cloudy from "../assets/icons/cloudy.png";
import weatherData from "../weather.json";
import { theme } from "../theme";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
// import { weatherImages } from '../constants';
import { getData, storeData } from "../utils/asyncStorage";

const HomeScreen = () => {
	const [isToggleSearch, setIsToggleSearch] = useState(false);
	const [locations, setLocations] = useState([]);
	const [weather, setWeather] = useState({});
	const [loading, setLoading] = useState(true);

	const handleLocation = (loc) => {
		setLocations([]);
		setIsToggleSearch(false);
		setLoading(true);
		fetchWeatherForecast({
			cityName: loc?.name,
			days: "14",
		}).then((data) => {
			setWeather(data);
			setLoading(false);
			storeData("city", loc.name);
		});
	};

	const handleSearch = (value) => {
		// fetch locations
		if (value.length > 2) {
			fetchLocations({ cityName: value }).then((data) => {
				setLocations(data);
			});
		}
	};

	useEffect(() => {
		fetchMyWeatherData();
	}, []);

	const fetchMyWeatherData = async () => {
		let myCity = await getData("city");
		let cityName = "Kyiv";
		if (myCity) cityName = myCity;
		try {
			const data = await fetchWeatherForecast({ cityName, days: "14" });
			setWeather(data);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch weather data:", error);
			setLoading(false);
		}
	};
	const handleTextDebounce = useCallback(debounce(handleSearch, 1000), []);
	const { current, location } = weather;

	console.log(weather?.forecast?.forecastday);

	return (
		<View className="flex-1 relative">
			<StatusBar style="light" />
			<Image source={bacgraundImage} blurRadius={65} className="absolute h-full w-full" />
			{loading ? (
				<View className="flex-1 flex-row justify-center items-center">
					<Progress.CircleSnail thickness={10} size={120} color={"#00CED1"} />
				</View>
			) : (
				<SafeAreaView className="flex flex-1">
					<View style={{ height: "7%" }} className="mx-4 relative z-50">
						<View
							className="flex-row justify-end rounded-full"
							style={{ backgroundColor: isToggleSearch ? theme.bgWhite(0.175) : "transparent" }}>
							{isToggleSearch ? (
								<TextInput
									onChangeText={handleTextDebounce}
									placeholder="Search city"
									placeholderTextColor={"#FFF8DC"}
									className="px-6 h-10 flex-1 text-2xl text-white"
								/>
							) : null}

							<TouchableOpacity
								onPress={() => setIsToggleSearch(!isToggleSearch)}
								style={{ backgroundColor: theme.bgWhite(0.4) }}
								className="rounded-full p-3 m-1">
								<MagnifyingGlassIcon size={25} color="white" />
							</TouchableOpacity>
						</View>
						{locations.length > 0 && isToggleSearch ? (
							<View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
								{locations.map((loc, index) => {
									let showBorder = index + 1 !== locations.length;
									let borderClass = showBorder ? "border-b-2 border-b-gray-400" : "";
									return (
										<TouchableOpacity
											onPress={() => handleLocation(loc)}
											key={index}
											className={"flex-row items-center p-3 px-4 mb-1 " + borderClass}>
											<MapPinIcon size="20" color="gray" />
											<Text className="text-black text-lg ml-2">
												{loc?.name}, {loc?.country}
											</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						) : null}
					</View>
					{/* Forecast section */}
					<View className="flex-1 flex justify-around mx-4 mb-2">
						{/* Location */}
						<Text className="text-white text-center text-2xl font-bold">
							{location?.name},
							<Text className="text-lg font-semibold text-gray-300">{" " + location?.country}</Text>
						</Text>
						{/* Weather image */}
						<View className="flex-row flex justify-center">
							<Image source={weatherData[current?.condition?.text]} className="w-52 h-52" />
						</View>
						{/* Degree celcius */}
						<View className="space-y-2">
							<Text className="text-center font-bold text-white text-6xl ml-5">
								{current?.temp_c}&#176;
							</Text>
							<Text className="text-center text-white text-xl tracking-widest">
								{current?.condition?.text}
							</Text>
						</View>
						{/* Other stats */}
						<View className="flex-row justify-around mx-4">
							<View className="flex-row space-x-2 items-center">
								<Image source={wind} className="h-6 w-6" />
								<Text className="text-white font-semibold text-base">{current?.wind_kph}km</Text>
							</View>
							<View className="flex-row space-x-2 items-center">
								<Image source={drop} className="h-6 w-6" />
								<Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
							</View>
							<View className="flex-row space-x-2 items-center">
								<Image source={cloudy} className="h-6 w-6" style={{ fill: "white" }} />
								<Text className="text-white font-semibold text-base">{current?.cloud}%</Text>
							</View>
							<View className="flex-row space-x-2 items-center">
								<Image source={sun} className="h-6 w-6" />
								<Text className="text-white font-semibold text-base">
									{weather?.forecast?.forecastday[0]?.astro?.sunrise}
								</Text>
							</View>
						</View>
						{/* Forecast for next days */}
						<View className="mb-2 space-y-3">
							<View className="flex-row items-centr mx-5 space-x-2">
								<CalendarDaysIcon size="22" color="white" />
								<Text className="text-white text-base">Daily forecast</Text>
							</View>
							<ScrollView
								horizontal
								contentContainerStyle={{ paddingHorizontal: 15 }}
								showsHorizontalScrollIndicator={false}>
								{weather?.forecast?.forecastday?.map((item, index) => {
									let date = new Date(item.date);
									let options = { weekday: "long" };
									let dayName = date.toLocaleDateString("en-US", options);
									dayName = dayName.split(",")[0];
									return (
										<View
											key={index}
											className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
											style={{ backgroundColor: theme.bgWhite(0.15) }}>
											<Image
												source={weatherData[item?.day?.condition?.text]}
												className=" h-11 w-11"
											/>
											<Text className="text-white">{dayName}</Text>
											<Text className="text-white text-xl font-semibold">
												{item?.day?.avgtemp_c}&#176;
											</Text>
										</View>
									);
								})}
							</ScrollView>
						</View>
					</View>
				</SafeAreaView>
			)}
		</View>
	);
};
export default HomeScreen;
