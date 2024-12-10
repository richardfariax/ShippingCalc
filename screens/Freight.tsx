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
import {
  markFreightAsCompleted,
  markFreightAsOpen,
  updateFreight,
  deleteFreight,
} from "../model/freight";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/CreateFreight";

export default function Freight({ route }) {
  const navigation = useNavigation();
  const freight = route?.params?.freight;

  if (!freight) {
    Alert.alert(
      "Erro",
      "Nenhum frete foi carregado. Volte para a tela anterior."
    );
    navigation.goBack();
  }

  const [value, setValue] = useState(freight?.value || "");
  const [cargoType, setCargoType] = useState(freight?.cargoType || "");
  const [openedDate] = useState(freight?.openedDate || "");
  const [createdBy, setCreatedBy] = useState("");
  const [status, setStatus] = useState(freight.status);

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
    if (!value.trim() || !cargoType.trim()) {
      showAlert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const updatedFreight = {
        id: freight?.id,
        value,
        cargoType,
        openedDate,
        createdBy,
      };

      const rowsAffected = await updateFreight(updatedFreight);

      if (rowsAffected > 0) {
        navigation.goBack();
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
              await deleteFreight(freight?.id);
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

  const handleToggleFreightStatus = async () => {
    try {
      if (status === "Aberto") {
        await markFreightAsCompleted(freight.id);
        setStatus("Concluído");
        Alert.alert("Sucesso", "Frete concluído com sucesso.");
        navigation.goBack();
      } else {
        await markFreightAsOpen(freight.id);
        setStatus("Aberto");
        Alert.alert("Sucesso", "Frete reaberto com sucesso.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao alternar status do frete:", error);
      showAlert("Erro", "Não foi possível alterar o status do frete.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Valor do Frete:</Text>
      <TextInput
        style={styles.input}
        placeholder="R$ 0,00"
        value={value}
        keyboardType="numeric"
        onChangeText={(text) => setValue(text)}
      />

      <Text style={styles.title}>Tipo da Carga:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo da Carga"
        value={cargoType}
        onChangeText={(text) => setCargoType(text)}
      />

      <Text style={styles.title}>Status: {status}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSaveFreight}>
        <Text style={styles.buttonText}>Salvar Frete</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={handleDeleteFreight}
      >
        <Text style={styles.buttonText}>Excluir Frete</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: status === "Aberto" ? "green" : "orange" },
        ]}
        onPress={handleToggleFreightStatus}
      >
        <Text style={styles.buttonText}>
          {status === "Aberto" ? "Concluir Frete" : "Reabrir Frete"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
