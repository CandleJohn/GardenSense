import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "firebase/firestore";
import { db } from './config/firebase';
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import {
  Chart as ChartJS,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const App = () => {
  const [humidityData, setHumidityData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [lightData, setLightData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [currentProfile, setCurrentProfile] = useState("");
  const [humidityToggle, setHumidityToggle] = useState(false);
  const [tempToggle, setTempToggle] = useState(false);
  const [lightToggle, setLightToggle] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newMinTemp, setNewMinTemp] = useState(0);
  const [newMaxTemp, setNewMaxTemp] = useState(0);
  const [newMinHum, setNewMinHum] = useState(0);
  const [newMaxHum, setNewMaxHum] = useState(0);
  const [newMinLight, setNewMinLight] = useState(0);
  const [newMaxLight, setNewMaxLight] = useState(0);

  const humidityCollectionRef = collection(db, "humidity");
  const temperatureCollectionRef = collection(db, "temperature");
  const lightCollectionRef = collection(db, "light");
  const hToggleRef = collection(db, "humidityAcc");
  const tToggleRef = collection(db, "temperatureAcc");
  const lToggleRef = collection(db, "lightAcc");
  const profilesCollectionRef = collection(db, "plantProfile");
  const currentProfileCollectionRef = collection(db, "currentProfile");

  function sortArray(arr) {
    for (let obj of arr) {
      obj.time = new Date(obj.time);
    }
    // Sort array of objects by date value
    arr.sort((a, b) => a.time - b.time);
    return arr;
  }

  function formatValue(arr) {
    for (let obj of arr) {
      obj.value = obj.value.toFixed(2);
    }
    return arr;
  }

  const handleProfileClick = async (id) => {
    let docRef = doc(db, "currentProfile", "profileName");
    let data = { name: id };
    await updateDoc(docRef, data)
    .then(docRef => {
      console.log("Current profile updated")
    })
    .catch(err => {
      console.error(err);
    })
    setCurrentProfile(id);
  };

  const onSubmitProfile = async () => {
    let docRef = doc(db, "plantProfile", newProfileName);
    let data = {
      minTemp: newMinTemp,
      maxTemp: newMaxTemp,
      minHum: newMinHum,
      maxHum: newMaxHum,
      minLight: newMinLight,
      maxLight: newMaxLight,
    }
    await setDoc(docRef, data)
      .then(() => {
        console.log("New Profile added")
      }).catch(err => {
        console.error(err);
      })
    getProfileData();
  }

  const onToggleHumidity = async () => {
    let docRef = doc(db, "humidityAcc", "Actuation");
    let data = {};
    if (humidityToggle) {
      data = { toggle: false }
      await updateDoc(docRef, data)
        .then(docRef => {
          console.log("Doc Updated false")
        })
        .catch(error => {
          console.error(error);
        })
      setHumidityToggle(false)
    } else {
      data = { toggle: true }
      await updateDoc(docRef, data)
        .then(docRef => {
          console.log("Doc Updated true")
        })
        .catch(error => {
          console.error(error);
        })
      setHumidityToggle(true)
    }
  }

  const onToggleTemp = async () => {
    let docRef = doc(db, "temperatureAcc", "Actuation");
    let data = {};
    if (tempToggle) {
      data = { toggle: false }
      await updateDoc(docRef, data)
        .then(docRef => {
          console.log("Doc Updated false")
        })
        .catch(error => {
          console.error(error);
        })
      setTempToggle(false)
    } else {
      data = { toggle: true }
      await updateDoc(docRef, data)
        .then(docRef => {
          console.log("Doc Updated true")
        })
        .catch(error => {
          console.error(error);
        })
      setTempToggle(true)
    }
  }

  const onToggleLight = async () => {
    let docRef = doc(db, "lightAcc", "Actuation");
    let data = {};
    if (lightToggle) {
      data = { toggle: false }
      await updateDoc(docRef, data)
        .then(docRef => {
          console.log("Doc Updated false")
        })
        .catch(error => {
          console.error(error);
        })
      setLightToggle(false)
    } else {
      data = { toggle: true }
      await updateDoc(docRef, data)
        .then(docRef => {
          console.log("Doc Updated true")
        })
        .catch(error => {
          console.error(error);
        })
      setLightToggle(true)
    }
  }

  useEffect(() => {
    const getHumidData = async () => {
      try {
        const data = await getDocs(humidityCollectionRef);
        let filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        filteredData = sortArray(filteredData)
        filteredData = formatValue(filteredData)
        console.log("Humid")
        console.log(filteredData)
        setHumidityData(filteredData)
      } catch (err) {
        console.error(err);
      }
    };

    getHumidData();
  }, []);

  const getTemperatureData = async () => {
    try {
      const data = await getDocs(temperatureCollectionRef);
      let filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      filteredData = sortArray(filteredData)
      filteredData = formatValue(filteredData)
      console.log("Temp")
      console.log(filteredData)
      setTempData(filteredData)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTemperatureData();
  }, []);

  const getLightData = async () => {
    try {
      const data = await getDocs(lightCollectionRef);
      let filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      filteredData = sortArray(filteredData)
      console.log("Light")
      console.log(filteredData)
      setLightData(filteredData)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLightData();
  }, []);

  const getProfileData = async () => {
    try {
      const data = await getDocs(profilesCollectionRef);
      let filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("Profiles")
      console.log(filteredData)
      setProfileData(filteredData)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    const getHumidToggle = async () => {
      try {
        const data = await getDocs(hToggleRef);
        let filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("Humid T")
        console.log(filteredData[0].toggle)
        setHumidityToggle(filteredData[0].toggle)
      } catch (err) {
        console.error(err);
      }
    };

    getHumidToggle();
  }, []);

  useEffect(() => {
    const getTempToggle = async () => {
      try {
        const data = await getDocs(tToggleRef);
        let filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("Temp T")
        console.log(filteredData[0].toggle)
        setTempToggle(filteredData[0].toggle)
      } catch (err) {
        console.error(err);
      }
    };

    getTempToggle();
  }, []);

  useEffect(() => {
    const getLightToggle = async () => {
      try {
        const data = await getDocs(lToggleRef);
        let filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("Light T")
        console.log(filteredData[0].toggle)
        setLightToggle(filteredData[0].toggle)
      } catch (err) {
        console.error(err);
      }
    };

    getLightToggle();
  }, []);

  useEffect(() => {
    const getCurrentProfile = async () => {
      try {
        const data = await getDocs(currentProfileCollectionRef);
        let filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("Current")
        console.log(filteredData[0].name)
        setCurrentProfile(filteredData[0].name)
      } catch (err) {
        console.error(err);
      }
    };

    getCurrentProfile();
  }, []);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        }
      },
      y: {
        beginAtZero: true,
        max: 50,
      },
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Temperature',
        align: "center",
        font: {
          weight: 'bold',
          size: 20
        }
      },
    }
  };

  const lOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        }
      },
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Light',
        align: "center",
        font: {
          weight: 'bold',
          size: 20
        }
      },
    }
  };

  const hoptions = {
    responsive: true,
    title: 'Humidity',
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Humidity',
        align: "center",
        font: {
          weight: 'bold',
          size: 20
        }
      },
    }
  };


  const hData = {
    labels: humidityData.map((date) => date.time),
    datasets: [
      {
        label: 'Humidity Dataset',
        data: humidityData.map((v) => v.value),
        borderColor: 'rgb(34,139,34)',
        backgroundColor: 'rgba(34,139,34, 0.5)',
      },
    ],
  };

  const tData = {
    labels: tempData.map((date) => date.time),
    datasets: [
      {
        label: 'Temperature Dataset',
        data: tempData.map((v) => v.value),
        borderColor: 'rgb(34,139,34)',
        backgroundColor: 'rgba(34,139,34, 0.5)',
      },
    ],
  };

  const lData = {
    labels: lightData.map((date) => date.time),
    datasets: [
      {
        label: 'Light Dataset',
        data: lightData.map((v) => v.value),
        borderColor: 'rgb(34,139,34)',
        backgroundColor: 'rgba(34,139,34, 0.5)',
        tension: 0.1,
        fill: false
      },
    ],
  };

  return (
    <>
      <div className="mainSection">
        <div className="charts">
          <div className="dataChart"><Line options={hoptions} data={hData} /></div>
          <div className="dataChart"><Line options={options} data={tData} /></div>
          <div className="dataChart"><Line options={lOptions} data={lData} /></div>
        </div>
        <div className="currentValues">
          <div className="current">
            <h2>Current Humidity</h2>
            {humidityData && humidityData.length > 0 ? (
              <h3>{humidityData[humidityData.length - 1].value}%</h3>
            ) : (
              <p>No data available</p>
            )}
            {humidityToggle ? (
              <h3>Pump On</h3>
            ) : (
              <h3>Pump Off</h3>
            )}
            <button onClick={onToggleHumidity}>Water Plant</button>
          </div>
          <div className="current">
            <h2>Current Temperature</h2>
            {tempData && tempData.length > 0 ? (
              <h3>{tempData[tempData.length - 1].value}°C</h3>
            ) : (
              <p>No data available</p>
            )}
            {tempToggle ? (
              <h3>Fan On</h3>
            ) : (
              <h3>Fan Off</h3>
            )}
            <button onClick={onToggleTemp}>Toggle Fan</button>
          </div>
          <div className="current">
            <h2>Current Light</h2>
            {lightData && lightData.length > 0 ? (
              <h3>{lightData[lightData.length - 1].value}</h3>
            ) : (
              <p>No data available</p>
            )}
            {lightToggle ? (
              <h3>Lamp On</h3>
            ) : (
              <h3>Lamp Off</h3>
            )}
            <button onClick={onToggleLight}>Toggle Lamp</button>
          </div>
        </div>
        <div className="profiles">
          <div className="profileForm">
            <h2>Add New Plant Profile</h2>
            <input
              placeholder="Profile name..."
              onChange={(e) => setNewProfileName(e.target.value)}
            />
            <input
              placeholder="Minimum Temperature..."
              onChange={(e) => setNewMinTemp(e.target.value)}
            />
            <input
              placeholder="Maximum Temperature..."
              onChange={(e) => setNewMaxTemp(e.target.value)}
            />
            <input
              placeholder="Minimum Humidity..."
              onChange={(e) => setNewMinHum(e.target.value)}
            />
            <input
              placeholder="Maximum Humidity..."
              onChange={(e) => setNewMaxHum(e.target.value)}
            />
            <input
              placeholder="Minimum Light..."
              onChange={(e) => setNewMinLight(e.target.value)}
            />
            <input
              placeholder="Maximum Light..."
              onChange={(e) => setNewMaxLight(e.target.value)}
            />
            <button onClick={onSubmitProfile}>Add New Profile</button>
          </div>
          <div className="profileList">
          <h2>Select Profile</h2>
            {profileData && profileData.length > 0 ? (
              profileData.map((data) => (
                <button key={data.id} onClick={() => handleProfileClick(data.id)}>{data.id}</button>
              ))
            ) : (
              <p>No profiles available</p>
            )}
          </div>
          <div className="currentProfile">
              <h2>Current Profile</h2>
            {profileData && profileData.length > 0 ? (
              profileData.map((data) => (
                <div key={data.id}>
                  {data.id === currentProfile ? (
                    <div>
                      <h3>Profile : {data.id}</h3>
                      <p>Minimum Temperature: {data.minTemp}°C </p>
                      <p>Maximum Temperature: {data.maxTemp}°C </p>
                      <p>Minimum Humidity: {data.minHum}% </p>
                      <p>Maximum Humidity: {data.maxHum}% </p>
                      <p>Minimum Light: {data.minLight} </p>
                      <p>Maximum Light: {data.maxLight} </p>
                      {/* Render other data properties as needed */}
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
};

export default App;
