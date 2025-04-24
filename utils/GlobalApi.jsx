const { default: axios } = require('axios');



const getReward = async (token) => {
    try {

        let data = JSON.stringify({
            "token": token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://talktango.estamart.com/api/get_rewards',
            headers: {
                'Content-Type': 'application/json',

            },
            data: data
        };

        const response = await axios.request(config)
        return response?.data;
    } catch (error) {

        console.log('error while getting rewards data');

        return error;
    }
}


const getearning = async (token) => {
    try {


        let data = JSON.stringify({
            "token": token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://talktango.estamart.com/api/getEarnings',
            headers: {
                'Content-Type': 'application/json',

            },
            data: data
        };

        const response = await axios.request(config);
        return response?.data
    } catch (error) {
        console.log('error getting earnign data');

        return error;
    }
}


const getleaderboad = async (token) => {
    try {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://talktango.estamart.com/api/get_leaderboard',
            headers: {

            },

        };

        const response = await axios.request(config);
        return response?.data;
    } catch (error) {
        console.log('error getting earnign data');

        return error;
    }
}

export default {
    getReward,
    getearning,
    getleaderboad
}