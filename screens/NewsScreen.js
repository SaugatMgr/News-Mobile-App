import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import {Linking} from 'react-native';
import {styles} from '../styles/styles';

const API_URL = 'http://10.0.2.2:8000/api/v1/news/';

const NewsScreen = () => {
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('general');
  const [news, setNews] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserLocation = async () => {
    try {
      const response = await axios.get('https://ipinfo.io/json');
      const userCountry = response.data.country.toLowerCase();
      setCountry(userCountry);
    } catch (err) {
      console.log('Failed to fetch location:', err);
    }
  };

  const fetchNewsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!country) {
      setError('Please select a country.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}?country=${country}&category=${category}`,
      );
      if (!response || !response.data) {
        throw new Error('Invalid response from server.');
      }

      setNews(response.data.news_data || []);
      setMessage(response.data.message);

      if (response.data.error) {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [country, category]);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [country, category, fetchNewsData]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>News App</Text>

        <RNPickerSelect
          onValueChange={value => setCountry(value)}
          items={[
            {label: 'United Arab Emirates', value: 'ae'},
            {label: 'Argentina', value: 'ar'},
            {label: 'Austria', value: 'at'},
            {label: 'Australia', value: 'au'},
            {label: 'Belgium', value: 'be'},
            {label: 'Bulgaria', value: 'bg'},
            {label: 'Brazil', value: 'br'},
            {label: 'Canada', value: 'ca'},
            {label: 'Switzerland', value: 'ch'},
            {label: 'China', value: 'cn'},
            {label: 'Colombia', value: 'co'},
            {label: 'Cuba', value: 'cu'},
            {label: 'Czech Republic', value: 'cz'},
            {label: 'Germany', value: 'de'},
            {label: 'Egypt', value: 'eg'},
            {label: 'France', value: 'fr'},
            {label: 'United Kingdom', value: 'gb'},
            {label: 'Greece', value: 'gr'},
            {label: 'Hong Kong', value: 'hk'},
            {label: 'Hungary', value: 'hu'},
            {label: 'Indonesia', value: 'id'},
            {label: 'Ireland', value: 'ie'},
            {label: 'Israel', value: 'il'},
            {label: 'India', value: 'in'},
            {label: 'Italy', value: 'it'},
            {label: 'Japan', value: 'jp'},
            {label: 'South Korea', value: 'kr'},
            {label: 'Lithuania', value: 'lt'},
            {label: 'Latvia', value: 'lv'},
            {label: 'Morocco', value: 'ma'},
            {label: 'Mexico', value: 'mx'},
            {label: 'Malaysia', value: 'my'},
            {label: 'Nigeria', value: 'ng'},
            {label: 'Netherlands', value: 'nl'},
            {label: 'Norway', value: 'no'},
            {label: 'New Zealand', value: 'nz'},
            {label: 'Philippines', value: 'ph'},
            {label: 'Poland', value: 'pl'},
            {label: 'Portugal', value: 'pt'},
            {label: 'Romania', value: 'ro'},
            {label: 'Serbia', value: 'rs'},
            {label: 'Russia', value: 'ru'},
            {label: 'Saudi Arabia', value: 'sa'},
            {label: 'Sweden', value: 'se'},
            {label: 'Singapore', value: 'sg'},
            {label: 'Slovenia', value: 'si'},
            {label: 'Slovakia', value: 'sk'},
            {label: 'Thailand', value: 'th'},
            {label: 'Turkey', value: 'tr'},
            {label: 'Taiwan', value: 'tw'},
            {label: 'Ukraine', value: 'ua'},
            {label: 'United States', value: 'us'},
            {label: 'Venezuela', value: 've'},
            {label: 'South Africa', value: 'za'},
          ]}
          placeholder={{label: 'Select a country', value: null}}
        />
        <RNPickerSelect
          onValueChange={value => setCategory(value)}
          items={[
            {label: 'business', value: 'business'},
            {label: 'entertainment', value: 'entertainment'},
            {label: 'general', value: 'general'},
            {label: 'health', value: 'health'},
            {label: 'science', value: 'science'},
            {label: 'sports', value: 'sports'},
            {label: 'technology', value: 'technology'},
          ]}
          placeholder={{label: 'Select a category', value: null}}
        />

        <Button title="Search" onPress={fetchNewsData} />

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View>
            {message ? <Text style={styles.messageText}>{message}</Text> : null}
            <FlatList
              data={news}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.newsItem}>
                  {item.image && (
                    <Image
                      source={{uri: item.image}}
                      style={styles.newsImage}
                    />
                  )}
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsAuthor}>
                    {item.author || 'Unknown Author'}
                  </Text>
                  <Text style={styles.newsDescription}>{item.description}</Text>
                  <Text style={styles.newsDescription}>
                    {item.published_at}
                  </Text>
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => Linking.openURL(item.url)}>
                    <Text style={styles.readMoreText}>Read More</Text>
                  </TouchableOpacity>
                  ;
                </View>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewsScreen;
