import TextRecognition, {
    TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OcrComponentProps {
    photoPath: string;
    onClose: () => void;
}

const OcrComponent = ({ photoPath, onClose }: OcrComponentProps) => {
    const [loading, setLoading] = useState(true);
    const [detectedText, setDetectedText] = useState('');
    const [error, setError] = useState<string | null>(null);

    const detectText = async () => {
        try {
            const result = await TextRecognition.recognize("file://"+photoPath, TextRecognitionScript.JAPANESE);
            console.log(result.text);
            setDetectedText(result.text);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        detectText();
    }, [photoPath]);

    return (
        <View style={styles.container}>
            
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <>
                    <Image source={{ uri: "file://"+photoPath }} style={styles.image} />
                    {/* <Text style={styles.detectedText}>{detectedText}</Text> */}
                </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text>閉じる</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detectedText: {
        margin: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        margin: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    image: {
        width: 500,
        height: 500,
        marginBottom: 20,
    },
    closeButton:{
        marginTop: 20, // ボタンと写真の間にスペースを作る
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    }

});

export default OcrComponent;
