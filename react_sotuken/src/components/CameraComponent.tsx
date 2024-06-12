// import React, { useEffect, useRef, useState } from 'react';
// import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
// import OcrComponent from './OcrComponent';

// const CameraComponent = ({ onClose }) => {
//     const { hasPermission, requestPermission } = useCameraPermission();
//     const device = useCameraDevice('back');
//     const camera = useRef(null);
//     const [capturedPhoto, setCapturedPhoto] = useState(null); // ここに撮影した写真のパスを保持する

//     useEffect(() => {
//         if (hasPermission === false) {
//             requestPermission();
//         }
//     }, [hasPermission]);

//     const takePhoto = async () => {
//         if (camera.current) {
//             const photo = await camera.current.takePhoto({ enableShutterSound: false });
//             console.log(photo.path);
//             // 撮影後の処理
//             setCapturedPhoto(photo.path); // 撮影した写真のパスをstateに保存
//         }
//     };

//     if (hasPermission === true) {
//         if (!device) {
//             return <Text>カメラが見つかりませんでした。</Text>;
//         }
//         return (
//             <View style={{ flex: 1 }}>
//                 {capturedPhoto ? (
//                     <OcrComponent photoPath={capturedPhoto} onClose={onClose} />
//                 ) : (
//                     <>
//                         <Camera
//                             ref={camera}
//                             style={{ flex: 1 }}
//                             device={device}
//                             isActive={true}
//                             photo={true}  // 追記
//                         />
//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity style={styles.button} onPress={takePhoto}>
//                                 <Text style={styles.buttonText}>撮影</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View style={styles.closeButtonContainer}>
//                             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//                                 <Text style={styles.closeButtonText}>×</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </>
//                 )}
//             </View>
//         );
//     } else if (hasPermission === false) {
//         return (
//             <View>
//                 <Text>カメラの権限が必要です。</Text>
//                 <Button title="設定を開く" onPress={() => Linking.openSettings()} />
//             </View>
//         );
//     } else {
//         return <Text>権限を要求中...</Text>;
//     }
// };

// const styles = StyleSheet.create({
//     buttonContainer: {
//         position: 'absolute',
//         bottom: 20,
//         alignSelf: 'center',
//     },
//     button: {
//         width: 70,
//         height: 70,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         borderRadius: 35,
//         opacity: 0.7,
//     },
//     buttonText: {
//         fontSize: 18,
//         color: '#000',
//     },
//     closeButtonContainer: {
//         position: 'absolute',
//         top: 20,
//         left: 20,
//         width: 40,
//         height: 40,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 10,
//     },
//     closeButton: {
//         width: 40,
//         height: 40,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         borderRadius: 20,
//     },
//     closeButtonText: {
//         color: 'white',
//         fontSize: 24,
//     },
// });

// export default CameraComponent;
