import { db } from "../config/firebase.js";
import { savePacketService } from "./ingest.service.js";

let lastPacketNo = 0;

const fetchFromFirebase = async () => {
  try {
    const snapshot = await db
      .collection("packets")
      .where("PACKET_NO", ">", lastPacketNo)
      .orderBy("PACKET_NO", "asc")
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log("[INGEST] No new packets");
      return;
    }

    const packets = snapshot.docs.map((doc) => doc.data());

    let maxPacketNo = lastPacketNo;

    for (const packet of packets) {
      await savePacketService(packet);

      if (packet.PACKET_NO > maxPacketNo) {
        maxPacketNo = packet.PACKET_NO;
      }
    }

    lastPacketNo = maxPacketNo;

    console.log(
      `[INGEST] ${packets.length} packets saved (last: ${lastPacketNo})`,
    );
  } catch (error) {
    console.error("[INGEST] Firebase fetch error:", error.message);
  }
};

export { fetchFromFirebase };
