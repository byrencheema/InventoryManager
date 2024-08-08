'use client';
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Modal, Typography, Stack, TextField, Button, Paper, IconButton } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { collection, setDoc, getDocs, query, getDoc, doc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });

    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, "inventory", item.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const itemNameToAdd = item ? item.name : itemName;

    if (!itemNameToAdd) return;

    const docRef = doc(firestore, "inventory", itemNameToAdd);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();

    if (!item) {
      setItemName("");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4} sx={{ bgcolor: "#f5f5f5", padding: 4 }}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top='50%' left='50%' bgcolor="white" p={4} borderRadius={2} width={400} boxShadow={3} sx={{ transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" label="Item Name" fullWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
            <Button variant="contained" color="primary" onClick={() => {
              addItem();
              handleClose();
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" onClick={handleOpen}>Add New Item</Button>
      <TextField 
        variant="outlined" 
        placeholder="Search inventory..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ width: '800px', mb: 4 }}
      />
      <Paper sx={{ width: '800px', maxHeight: '60vh', overflow: 'auto', padding: 2, boxShadow: 3 }}>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mb={2}>
          <Typography variant="h4" color="#333">Inventory</Typography>
        </Box>
        <Stack direction="column" spacing={2}>
          {
            filteredInventory.map((item) => (
              <Box key={item.name} display="flex" alignItems="center" justifyContent="space-between" p={2} sx={{ bgcolor: "#e3e3e3", borderRadius: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>{item.name}</Typography>
                <Typography variant="h6" sx={{ width: '100px', textAlign: 'left', mr: 2 }}>{item.quantity}</Typography>
                <Box display="flex" gap={1}>
                  <IconButton color="secondary" onClick={() => { removeItem(item) }}>
                    <RemoveCircle />
                  </IconButton>
                  <IconButton color="primary" onClick={() => { addItem(item) }}>
                    <AddCircle />
                  </IconButton>
                </Box>
              </Box>
            ))
          }
        </Stack>
      </Paper>
    </Box>
  );
}
