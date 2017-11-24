import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';

import firebase from 'firebase';  // Initialize Firebase
import RNFetchBlob from 'react-native-fetch-blob';
import firebaseApp from '../config/FirebaseConfig';
// import bg from './src/images/bg.jpg';

import colors from '../styles/colors';
import cardStyle from '../styles/card';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// test data
const DATA = [
    {
        id: 1,
        uri: 'https://i.imgur.com/wO7pizCb.jpg',
        name: 'TURQUOISE',
        code: '#1abc9c'
    }, {
        id: 2,
        uri: 'https://i.imgur.com/AD3MbBi.jpg',
        name: 'EMERALD',
        code: '#2ecc71'
    },
    {
        id: 3,
        uri: 'https://i.imgur.com/mtbl1crb.jpg',
        name: 'PETER RIVER',
        code: '#3498db'
    }, {
        id: 4,
        uri: 'https://i.imgur.com/igt12tfb.jpg',
        name: 'AMETHYST',
        code: '#9b59b6'
    },
    {
        id: 5,
        uri: 'https://i.imgur.com/QxR8tQhb.jpg',
        name: 'WET ASPHALT',
        code: '#34495e'
    }, {
        id: 6,
        uri: 'https://i.imgur.com/WktFupPb.jpg',
        name: 'GREEN SEA',
        code: '#16a085'
    },
    {
        id: 7,
        uri: 'https://i.imgur.com/gM5yeySb.jpg',
        name: 'NEPHRITIS', code: '#27ae60'
    },
    {
        id: 8,
        uri: 'https://i.imgur.com/YrLxxk8b.jpg',
        name: 'BELIZE HOLE',
        code: '#2980b9'
    },

];
var likedCards = [], dislikedCards = [], cards = [{
    id: 8,
    uri: 'https://i.imgur.com/YrLxxk8b.jpg',
    name: 'BELIZE HOLE',
    code: '#2980b9'
}];

export default class TestCards extends Component {


    constructor(props, context) {
        super(props, context);
        console.log('~~~~~~~~~~~name called~~~~~~~~~~`');
        this.state = {
            showSignCard: false,
            cardsData: cards,
            likedCards: [],
            dislikedCards: [],
        }
    }

    getImageByName = (name) => {
        console.log('name', name);
        var storageRef = firebase.storage().ref('/images');

        //dynamically set reference to the file name
        var thisRef = storageRef.child(name+'.jpg');
        console.log('thisRef', thisRef);
        //put request upload file to firebase storage
        thisRef.getDownloadURL().then(function (url) {
            console.log('Uploaded a blob or file!', url);
            cards.push({
                id: name,
                uri: url,
                name: name,
                code: '#2980b9'
            })
        });

    }
    getImagesByName = () => {
        console.log('names')
        this.getImageByName('1');
        this.getImageByName('2')
        this.getImageByName('3')
        this.getImageByName('4')

    }
    componentWillMount() {
        console.log('GrandChild will mount.');



    }

    componentDidMount() {
        console.log('GrandChild did mount.');
        this.getImagesByName();
        this.setState({
            cardsData: cards
        })
    }


    getImages = () => {
        var self = this;
        var storageRef = firebase.storage().ref("images/1.jpg");///avatar.jpeg
        storageRef.getDownloadURL().then(function (url) {
            console.log(url);
            var addImage = {
                id: 9,
                uri: url,
                name: 'cat',
                code: '#2980b9'
            }
            console.log('this.state.cardsData', self.state.cardsData)
            var cardsData = self.state.cardsData;
            cardsData.push(addImage);
            console.log('cards ', cardsData)
            self.setState({cardsData: cardsData})
        });

    }

    renderCard(card) {
        return (
            <Card
                key={card.id}
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 250,
                }}
                featuredTitle={`${card.name}`}
                featuredTitleStyle={{
                    position: 'absolute',
                    left: 15,
                    bottom: 15,
                    fontSize: 30,
                }}
                image={{uri: card.uri}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 252,
                }}
            />
        );
    }

    onSwipeRight(card) {
        // console.log('Card liked: ' + card.name, 'Card is ', card);

        likedCards.push(card);
        console.log('likedCards ', likedCards)
        // this.setState({likedCards: likedCards});

    }

    onSwipeLeft(card) {
        // console.log('Card disliked: ' + card.name, 'Card is ', card);
        dislikedCards.push(card);

    }

    gotoMyCards = () => {
        console.log('pass likedCards', likedCards)
        this.props.navigation.navigate('MyCardTab', {likedCards: likedCards});
    }


    renderNoMoreCards() {
        return (
            <Card
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 250,
                }}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={{uri: 'https://i.imgflip.com/1j2oed.jpg'}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 252
                }}
            />
        );
    }

    renderHeader() {
        return (
            <View style={cardStyle.header}>
                <View style={cardStyle.headerCenter}>
                    <View style={cardStyle.titleContainer}>
                        <Icon name="hand-o-right" type="font-awesome" color={colors.primary1} size={20}/>
                        <Text style={cardStyle.title}>1. Swipe your card</Text>
                    </View>
                    <View style={cardStyle.titleContainer}>
                        <Icon name="cart-plus" type="font-awesome" color={colors.primary1} size={20}/>
                        <Text style={cardStyle.title}>2. Add liked to My Cards</Text>
                    </View>

                </View>
                <View style={cardStyle.headerRightIcon}>
                    <Icon name="refresh" type="font-awesome" color={colors.primary1} size={35}
                          onPress={this.getImagesByName}
                    />
                    <Icon name="cart-plus" type="font-awesome" color={colors.primary1} size={35}
                          onPress={this.gotoMyCards}
                    />
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={cardStyle.cardsContainer}>
                {this.renderHeader()}

                <View style={cardStyle.deck}>
                    <SwipeDeck
                        data={this.state.cardsData}
                        renderCard={this.renderCard}
                        renderNoMoreCards={this.renderNoMoreCards}
                        onSwipeRight={this.onSwipeRight}
                        onSwipeLeft={this.onSwipeLeft}
                    />
                </View>
            </View>
        );
    }
}



