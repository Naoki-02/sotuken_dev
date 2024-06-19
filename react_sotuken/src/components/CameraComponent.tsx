import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera';
import { RootStackParamList } from '../types';
import OcrComponent from './OcrComponent';

interface CameraComponentProps {
    navigation: StackNavigationProp<RootStackParamList, 'Camera'>;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ navigation }) => {
    const { hasPermission, requestPermission } = useCameraPermission(); // カメラの権限を取得する
    const device = useCameraDevice('back'); // カメラのデバイスを取得する
    // console.log(device);
    const camera = useRef<Camera>(null); //カメラの参照の取得
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null); // ここに撮影した写真のパスを保持する

    // 初回起動時にカメラの権限をリクエストする
    useEffect(() => {
        if (hasPermission === false) {
            // カメラの権限がない場合はリクエストする
            requestPermission();
        }
    }, []);

    // 撮影ボタンが押されたときの処理
    const takePhoto = async () => {
        if (camera.current) {
            const photo = await camera.current.takePhoto({ enableShutterSound: false });
            console.log(photo);
            // 撮影後の処理
            setCapturedPhoto(photo.path); // 撮影した写真のパスをstateに保存
        }
    };

    const format = useCameraFormat(device, [
        { videoResolution: { width: 1920, height: 1080 } },
    ])

    // カメラの権限がある場合
    if (hasPermission === true) {
        // カメラが見つからない場合
        if (!device) {
            return <Text>カメラが見つかりませんでした。</Text>;
        }
        // カメラが見つかった場合
        return (
            <View style={styles.container}>
                {capturedPhoto ? (
                    <OcrComponent photoPath={capturedPhoto} onClose={()=>navigation.goBack()}/>
                ) : (
                    <>
                        <Camera
                            ref={camera}
                            style={{ flex: 1 }}
                            device={device}
                            isActive={true}
                            photo={true}
                            fps={60}
                            format={format}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={takePhoto}>
                                <Text style={styles.buttonText}>撮影</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.closeButtonContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={()=> navigation.goBack()}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
        // カメラの権限がない場合
    } else if (hasPermission === false) {
        return (
            <View>
                <Text>カメラの権限が必要です。</Text>
                <Button title="設定を開く" onPress={() => Linking.openSettings()} />
            </View>
        );
        // カメラの権限を要求中の場合
    } else {
        return <Text>権限を要求中...</Text>;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    button: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 35,
        opacity: 0.7,
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 24,
    },
});

export default CameraComponent;
