import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { updateFreight, deleteFreight } from "../model/freight";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/CreateFreight";

export default function Freight({ route }) {
  const navigation = useNavigation();
  const { task } = route.params;

  const [origin, setOrigin] = useState(task.origin || null);
  const [destination, setDestination] = useState(task.destination || null);
  const [value, setValue] = useState(task.value || "");
  const [cargoType, setCargoType] = useState(task.cargoType || "");
  const [openedDate, setOpenedDate] = useState(task.openedDate || "");
  const [createdBy, setCreatedBy] = useState("");
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        setCreatedBy(username || "Desconhecido");
      } catch (error) {
        console.error("Erro ao buscar o nome de usuário:", error);
      }
    };

    getUsername();
  }, []);

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const handleSaveFreight = async () => {
    if (!origin || !destination || !value.trim() || !cargoType.trim()) {
      showAlert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const updatedFreight = {
        id: task.id,
        origin,
        destination,
        value,
        cargoType,
        openedDate,
        createdBy,
      };

      const rowsAffected = await updateFreight(updatedFreight);
      if (rowsAffected > 0) {
        console.log("Frete atualizado com sucesso");
        navigation.goBack();
      } else {
        console.error("Não foi possível atualizar o frete.");
      }
    } catch (error) {
      console.error("Erro ao salvar o frete:", error);
    }
  };

  const handleDeleteFreight = async () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza de que deseja excluir este frete?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFreight(task.id);
              console.log("Frete excluído com sucesso.");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir o frete:", error);
              showAlert("Erro", "Não foi possível excluir o frete.");
            }
          },
        },
      ]
    );
  };

  const handleMapPress = (e) => {
    if (!currentSelection) return;

    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (currentSelection === "origin") {
      setOrigin({ latitude, longitude });
    } else if (currentSelection === "destination") {
      setDestination({ latitude, longitude });
    }

    setIsMapModalVisible(false);
  };

  const openMapModal = (selection) => {
    setCurrentSelection(selection);
    setIsMapModalVisible(true);
  };

  const formatCurrencyOnInput = (value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    const floatValue = parseFloat(numericValue) / 100;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(floatValue);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Campo Origem */}
      <Text style={styles.title}>Origem:</Text>
      <TouchableOpacity onPress={() => openMapModal("origin")}>
        <MapView
          style={styles.map}
          region={
            origin
              ? {
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }
              : {
                  latitude: -23.55052,
                  longitude: -46.633308,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
          }
        >
          {origin && <Marker coordinate={origin} title="Origem" />}
        </MapView>
      </TouchableOpacity>

      {/* Campo Destino */}
      <Text style={styles.title}>Destino:</Text>
      <TouchableOpacity onPress={() => openMapModal("destination")}>
        <MapView
          style={styles.map}
          region={
            destination
              ? {
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }
              : {
                  latitude: -23.55052,
                  longitude: -46.633308,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
          }
        >
          {destination && <Marker coordinate={destination} title="Destino" />}
        </MapView>
      </TouchableOpacity>

      <Text style={styles.title}>Valor do Frete:</Text>
      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        value={value}
        keyboardType="numeric"
        onChangeText={(text) => setValue(formatCurrencyOnInput(text))}
      />

      <Text style={styles.title}>Tipo da Carga:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo da Carga"
        value={cargoType}
        onChangeText={(text) => setCargoType(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveFreight}>
        <Text style={styles.buttonText}>Salvar Frete</Text>
      </TouchableOpacity>

      {/* Botão de Exclusão */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={handleDeleteFreight}
      >
        <Text style={styles.buttonText}>Excluir Frete</Text>
      </TouchableOpacity>

      {/* Modal de Mapa */}
      <Modal visible={isMapModalVisible} animationType="slide">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude:
              currentSelection === "origin"
                ? origin?.latitude || -23.55052
                : destination?.latitude || -23.55052,
            longitude:
              currentSelection === "origin"
                ? origin?.longitude || -46.633308
                : destination?.longitude || -46.633308,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {currentSelection === "origin" && origin && (
            <Marker coordinate={origin} title="Origem" />
          )}
          {currentSelection === "destination" && destination && (
            <Marker coordinate={destination} title="Destino" />
          )}
        </MapView>
        <TouchableOpacity
          style={[styles.button, { margin: 10 }]}
          onPress={() => setIsMapModalVisible(false)}
        >
          <Text style={styles.buttonText}>Fechar Mapa</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
