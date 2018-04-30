import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
    ScrollView,
    Dimensions,
    Linking,
    Alert,
} from 'react-native';
import {
    Icon,
} from 'react-native-elements';
import VersionCheck from 'react-native-version-check';

import Carousel from 'react-native-snap-carousel';
import Loader from 'react-native-mask-loader';
import Placeholder from 'rn-placeholder';

import layoutStyle from '../../styles/layout';
import carouselStyle from '../../styles/carousel';
import colors from '../../styles/colors';

import {sliderWidth, itemWidth} from '../../styles/sliderEntry';

import SliderEntry from '../../components/SliderEntry';
import  logo from '../../assets/images/logo.png';
import {
    getFreeImages,
    getAllImages,
} from '../../utils/FetchImagesByApi';
import  Utils from '../../utils/utils';

const birthdayImages = 'birthdayImages';
const holidayImages = 'holidayImages';
const weddingImages = 'weddingImages';
const otherImages = 'otherImages';
const downloadUrl = 'https://itunes.apple.com/us/app/cardmaker-app/id1318023993?mt=8';
const words = [

    {
        width: '60%',
    },
    {
        width: '40%',
    },
];

export default class Explore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            birthdayImages: [],
            holidayImages: [],
            weddingImages: [],
            otherImages: [],

            appReady: false,
            rootKey: Math.random(),
            connectionInfo: this.props.screenProps.connectionInfo
        };
        this.maskImage = logo;
    }


    fetchImages = (cardType) => {
        var self = this;
        //
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value

                getFreeImages(cardType).then(function (images) {
                    self.setState({[cardType]: images});
                });


            }, 500);
        });
    }

    navigateToShowAll = (cardType) => {
        this.props.navigation.navigate('CardsGallery', {
            cardType: cardType,
        });
    }

    // 点击立即下载只是跳转到商店,本地不做处理,如果没有更新,下次进入依然提醒
    // 点击稍后下载,本地记录时间,10天后再次提醒
    showAlert = () => {
        Alert.alert(
            'Update to the latest version',
            'Cardmaker App?',
            [
            {text: 'OK', onPress: () => Linking.openURL(downloadUrl)}, // open store if update is needed.
            {text: 'Download next time', onPress: () => console.log('update later')}
        ])
    }

    componentWillMount() {


        VersionCheck.needUpdate()
            .then(async res => {
                console.log(res.isNeeded);    // true
                if (res.isNeeded) {
                    this.showAlert();
                }
            });
        this.fetchImages(birthdayImages);
        this.fetchImages(holidayImages);
        this.fetchImages(weddingImages);
        this.fetchImages(otherImages);

        this.setState({
            contentIsLoading: true
        });

        setTimeout(() => {
            this.setState({contentIsLoading: false});
        }, 4000);
    }

    componentDidMount() {
        this.resetAnimation();
    }

    componentWillUnmount() {
        this.setState({
            birthdayImages: [],
            holidayImages: [],
            weddingImages: [],
            otherImages: [],
        })


    }

    resetAnimation() {
        this.setState({
            appReady: false,
            rootKey: Math.random()
        });

        setTimeout(() => {
            this.setState({
                appReady: true,
            });
        }, 1000);
    }


    renderItem = ({item, index}) => {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0}/>;
    }

    renderCarousel = (data, title, subtitle, isLoaded) => {
        const heightStyle = {height: 150};

        return (
            <View style={[carouselStyle.carouselContainer, !isLoaded && heightStyle]}>
                <Placeholder.MultiWords onReady={isLoaded} words={words} animate="fade">
                    <Carousel
                        data={data}
                        renderItem={this.renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={0.95}
                        inactiveSlideOpacity={1}
                        enableMomentum={true}
                        activeSlideAlignment={'start'}
                        containerCustomStyle={carouselStyle.slider}
                        contentContainerCustomStyle={carouselStyle.sliderContentContainer}
                        activeAnimationType={'spring'}
                        activeAnimationOptions={{
                            friction: 4,
                            tension: 40
                        }}
                    />
                </Placeholder.MultiWords>
            </View>
        );
    }

    componentWillReceiveProps(nextProps) {
        var isConnected = nextProps.screenProps.isConnected;//update netinfo
        if (this.props.screenProps.isConnected == false && isConnected == true) {
            this.resetAnimation();
        }

    }

    render() {
        var isConnected = this.props.screenProps.isConnected;

        if (!isConnected) {
            return Utils.renderOffline();
        }

        return (
            <View style={[layoutStyle.container, layoutStyle.maskLoader]} key={this.state.rootKey}>
                <Loader
                    isLoaded={this.state.appReady}
                    imageSource={this.maskImage}
                    backgroundStyle={layoutStyle.loadingBackgroundStyle}
                >
                    <ScrollView
                        style={carouselStyle.scrollView}
                        scrollEventThrottle={200}
                        directionalLockEnabled={true}>
                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Birthday'}</Text>
                                <TouchableOpacity onPress={() => this.navigateToShowAll(birthdayImages)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(this.state.birthdayImages, 'Birthday', 'Browse All', (!this.state.contentIsLoading))}
                        </View>
                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Holidays'}</Text>
                                <TouchableOpacity onPress={() => this.navigateToShowAll(holidayImages)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(this.state.holidayImages, 'Holidays', 'Browse All', (!this.state.contentIsLoading))}
                        </View>
                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Wedding'}</Text>
                                <TouchableOpacity onPress={() => this.navigateToShowAll(weddingImages)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>


                                </TouchableOpacity>

                            </View>
                            {this.renderCarousel(this.state.weddingImages, 'Wedding', 'Browse All', (!this.state.contentIsLoading))}
                        </View>

                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Others'}</Text>
                                <TouchableOpacity onPress={() => this.navigateToShowAll(otherImages)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(this.state.otherImages, 'Others', 'Browse All', (!this.state.contentIsLoading))}
                        </View>
                    </ScrollView>
                </Loader>
            </View>
        );
    }
}
