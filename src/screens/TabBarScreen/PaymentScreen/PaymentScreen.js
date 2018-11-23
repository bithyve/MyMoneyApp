import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    ImageBackground,
    Dimensions
} from 'react-native';
import { Container, Header, Title, Content, Button, Left, Right, Body, Text, Item, Input } from 'native-base';
import { RkCard } from 'react-native-ui-kitten';
import CardSilder from 'react-native-cards-slider';
import { UltimateListView, UltimateRefreshView } from 'react-native-ultimate-listview'
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './Styles';
import LoadingSpinner from './LoadingSpinner';
import ControlTab from './ControlTab';
import FlatListItem from './FlatListItem';
import FlatListGrid from './FlatListGrid';

const { width, height } = Dimensions.get('window')
export default class PaymentScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            layout: 'list',
            text: ''
        }
    }

    //TODO: Transtion Items
    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            // This is required to determinate whether the first loading list is all loaded.
            let pageLimit = 24
            if (this.state.layout === 'grid') pageLimit = 60
            const skip = (page - 1) * pageLimit

            // Generate dummy data
            let rowData = Array.from({ length: pageLimit }, (value, index) => `item -> ${index + skip}`)

            // Simulate the end of the list if there is no more data returned from the server
            if (page === 10) {
                rowData = []
            }

            // Simulate the network loading in ES7 syntax (async/await)
            await this.sleep(2000)
            startFetch(rowData, pageLimit)
        } catch (err) {
            abortFetch() // manually stop the refresh or pagination if it encounters network error
            console.log(err)
        }
    }

    onChangeLayout = (event) => {
        this.setState({ text: '' })
        switch (event.nativeEvent.selectedSegmentIndex) {
            case 0:
                this.setState({ layout: 'list' })
                break
            case 1:
                this.setState({ layout: 'grid' })
                break
            default:
                break
        }
    }

    onChangeScrollToIndex = (num) => {
        this.setState({ text: num })
        let index = num
        if (this.state.layout === 'grid') {
            index = num / 3
        }
        try {
            this.listView.scrollToIndex({ viewPosition: 0, index: Math.floor(index) })
        } catch (err) {
            console.warn(err)
        }
    }

    onPressItem = (type, index, item) => {
        Alert.alert(type, `You're pressing on ${item}`)
    }

    sleep = time => new Promise(resolve => setTimeout(() => resolve(), time))

    renderItem = (item, index, separator) => {
        if (this.state.layout === 'list') {
            return (
                <FlatListItem item={item} index={index} onPress={this.onPressItem} />
            )
        } else if (this.state.layout === 'grid') {
            return (
                <FlatListGrid item={item} index={index} onPress={this.onPressItem} />
            )
        }
        return null
    }

    renderControlTab = () => (
        <ControlTab
            layout={this.state.layout}
            onChangeLayout={this.onChangeLayout}
        />
    )

    renderHeader = () => (
        <View>
            <View style={styles.headerSegment}>
                <Left style={{ flex: 0.15 }} />
                {this.renderControlTab()}
                <Right style={{ flex: 0.15 }} />
            </View>
        </View>
    )

    renderPaginationFetchingView = () => (
        <LoadingSpinner height={height * 0.2} text="loading..." />
    )

    render() {
        return (
            <Container>
                <ImageBackground
                    source={require("../../../../assets/images/homescreen/homeBackgoundImage.png")}
                    style={styles.container}
                >
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.toggleDrawer()}>
                                <Icon name='bars' size={25} color="#ffffff" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Anant Tapadia</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon name='bell' size={15} color="#ffffff" />
                            </Button>
                            <Button transparent>
                                <Icon name='plus' size={25} color="#ffffff" />
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <CardSilder>
                            <RkCard style={styles.rkCard}>
                                <ImageBackground
                                    source={require("../../../../assets/images/paymentScreen/bitcoin1.jpg")}
                                    style={styles.container}
                                >
                                    <View rkCardHeader >
                                        <Text style={[styles.cardText, styles.cardTitle]}>Daily CBP</Text>
                                    </View>

                                    <View rkCardContent>
                                        <Text style={[styles.cardText, styles.cardType]}> Regular Account</Text>
                                        <Text style={[styles.cardText, styles.cardAmount]}> $ 5000.00</Text>
                                    </View>

                                </ImageBackground>
                            </RkCard>


                            <RkCard rkType='story' style={styles.rkCard}>
                                <ImageBackground
                                    source={require("../../../../assets/images/paymentScreen/bitcoin2.png")}
                                    style={styles.cardBackImage}
                                >
                                    <View rkCardHeader >
                                        <Text style={[styles.cardText, styles.cardTitle]}>React-Native</Text>
                                    </View>

                                    <View rkCardContent>
                                        <Text style={[styles.cardText, styles.cardType]}> Regular Account</Text>
                                        <Text style={[styles.cardText, styles.cardAmount]}> $ 45000.00</Text>
                                    </View>

                                </ImageBackground>
                            </RkCard>
                        </CardSilder>
                        <UltimateListView
                            ref={ref => this.listView = ref}
                            key={this.state.layout} // this is important to distinguish different FlatList, default is numColumns
                            onFetch={this.onFetch}
                            keyExtractor={(item, index) => `${index} - ${item}`} // this is required when you are using FlatList
                            item={this.renderItem} // this takes three params (item, index, separator)
                            numColumns={this.state.layout === 'list' ? 1 : 3} // to use grid layout, simply set gridColumn > 1
                            header={this.renderHeader}
                            paginationFetchingView={this.renderPaginationFetchingView}
                        />   

                    </Content>
                </ImageBackground>
            </Container >
        );
    }
}
