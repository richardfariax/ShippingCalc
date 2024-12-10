import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  titleInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },

  input: {
    width: "100%",
    height: 50,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#333333",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  deleteButtonFullWidth: {
    backgroundColor: "#E53935",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  button: {
    padding: 10,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#FFA726",
  },

  completeButton: {
    backgroundColor: "#43A047",
  },

  deleteButton: {
    backgroundColor: "#E53935",
  },

  map: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },

  modalButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 15,
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  mapButton: {
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },

  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
