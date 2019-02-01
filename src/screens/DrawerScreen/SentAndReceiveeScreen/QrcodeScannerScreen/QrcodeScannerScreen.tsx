import React from "react";
import { StyleSheet, Alert } from "react-native";
import { Container, Content } from "native-base";
import BarcodeScanner from "react-native-barcode-scanners";

export default class QrcodeScannerScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      address: ""
    };
  }

  onBarCodeRead(res: any) {
    //this.props.navigation.goBack();
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onSelect({ barcode: res.data });
  }

  onReadBarCodeByGalleryFailure() {
    Alert.alert("Note", "Not found barcode!");
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <BarcodeScanner
            Title={"QRCode Scanner"}
            styles={styles.barcodeScanner}
            cameraProps={{ captureAudio: false }}
            onBack={() => this.props.navigation.goBack()}
            onBarCodeReadByGalleryStart={data =>
              this.onBarCodeRead.call(this, data)
            }
            onReadBarCodeByGalleryFailure={() =>
              this.onReadBarCodeByGalleryFailure.call(this)
            }
            onBarCodeRead={data => this.onBarCodeRead.call(this, data)}
          />
        </Content>
      </Container>
    );
  }
}   

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20
  }
});
