import React, {Component} from 'react';
import {
    Text,
    View,
    Alert,
    ImageBackground,
    TouchableHighlight
} from 'react-native';

import GridView from 'react-native-super-grid';
// import firebaseApp from '../config/FirebaseConfig';
import {auth, db, storage} from '../config/FirebaseConfig';

import {Icon, Card, Button} from 'react-native-elements';
import Utils from '../utils/utils';

import colors from '../styles/colors';
import cardStyle from '../styles/card';
import buttonStyle from '../styles/button';

export default class MyCards extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            makeCards: null,
            chooseCards: [],
            signin: false,
            backgroundColor: "#5fba7d",

        }

    }

    componentDidMount() {
        var self = this;
        if (this.props.navigation.state.params) {
            var chooseCards = this.props.navigation.state.params.likedCards;
            var signin = this.props.navigation.state.params.signin;

            console.log('pass chooseCards cards in props', chooseCards)
            if (chooseCards.length > 0) {
                this.setState({
                    signin: signin,
                    chooseCards: chooseCards,
                    selectedItem: this.initialSelectedItem(chooseCards)
                })
            }
        }


        auth.onAuthStateChanged(function (user) {
            console.log('user?', user)
            if (!user) {
                self.setState({signin: false, chooseCards: []})
            } else {
                self.setState({signin: true})
            }
        });


    }

    componentWillReceiveProps(nextProps) {
        var chooseCards = nextProps.navigation.state.params.likedCards;
        // var signin = nextProps.navigation.state.params.signin;

        console.log('pass chooseCards cards', chooseCards)

        this.setState({chooseCards: chooseCards, selectedItem: this.initialSelectedItem(chooseCards)});

    }

    initialSelectedItem = (chooseCards) => {
        let selectedItemTemp = []
        for (let i = 0; i < chooseCards.length; i++) { //section.time_slots is your FlatList data
            selectedItemTemp.push(false)
        }
        return selectedItemTemp;

    }

    chooseCard = (item, index) => {
        var selectedItem = this.initialSelectedItem(this.state.chooseCards);

        selectedItem[index] = !selectedItem[index];
        this.setState({
            makeCards: item,
            selectedItem,
        });

    }

    gotoMakeCards = () => {
        if (this.state.makeCards) {
            this.props.navigation.navigate('MakeCardsTab', {
                chooseCards: this.state.makeCards,
                signin: this.state.signin
            });

        } else {
            Alert.alert('Please choose a template');
        }

    }

    renderHeader() {
        return (
            <View style={cardStyle.header}>
                <View style={cardStyle.headerCenter}>
                    <View style={cardStyle.titleContainer}>
                        <Icon name="hand-o-right" type="font-awesome" color={colors.primary1} size={20}/>
                        <Text style={cardStyle.title}>1. choose your card by just click it</Text>
                    </View>
                    <View style={cardStyle.titleContainer}>
                        <Icon name="card-giftcard" color={colors.primary1} size={20}/>
                        <Text style={cardStyle.title}>2. Add it to Make Cards</Text>
                    </View>
                </View>
                <View style={cardStyle.headerRightIcon}>
                    <Icon name="card-giftcard" color={colors.primary1} size={35}
                          onPress={this.gotoMakeCards}
                    />
                </View>
            </View>
        );
    }

    renderSignCard() {
        return (
            <Card title='Welcome to cardmaker'>
                <Text style={{marginBottom: 10}}>
                    Please sign in then choose picture to make card
                </Text>
                <Button
                    icon={{name: 'perm-identity'}}
                    buttonStyle={buttonStyle.submitButton}
                    title='Sign in /Sign up'
                    onPress={this.navigateToSignin}
                />
            </Card>
        );
    }

    renderCards() {
        return (
            <GridView
                itemWidth={130}
                items={this.state.chooseCards}
                style={cardStyle.gridView}
                renderItem={(item, index) => (
                    <TouchableHighlight onPress={() => this.chooseCard(item, index)}
                                        underlayColor='#99d9f4'>
                        <View
                            style={[cardStyle.itemContainer, {backgroundColor: (this.state.selectedItem[index]) ? '#EF85D0' : '#5fba7d'}]}>
                            <ImageBackground source={{uri: item.uri}} style={cardStyle.imageContainer}>
                                <Text style={cardStyle.itemName}>{item.name}</Text>
                            </ImageBackground>
                        </View>
                    </TouchableHighlight>


                )}
            />
        );
    }

    render() {
        console.log('this.state.chooseCards.length', this.state.chooseCards.length, 'signin?', this.state.signin)
        var renderCard = ((this.state.chooseCards.length > 0) && this.state.signin);
        var renderSign = this.state.signin;
        console.log('renderCard?', renderCard)
        if (renderCard) {
            return (
                <View style={cardStyle.container}>
                    {this.renderHeader()}
                    {this.renderCards()}

                </View>
            )

        }
        if (!renderSign) {
            return (
                <View style={cardStyle.container}>
                    {this.renderSignCard()}
                </View>
            )
        } else {
            return (
                <View style={cardStyle.container}>
                    {this.renderHeader()}
                </View>
            )
        }


    }

}



