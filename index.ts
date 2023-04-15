// ** React Imports
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";

// ** Store & Actions Imports
import Peer from "peerjs";
// import { useRouter } from "next/router";

import axios from "axios";
import { MediaConnection } from "peerjs";
import { io, Manager, Socket } from "socket.io-client";

import moment, { Moment } from "moment";

type UserType = "DEALER" | "CUSTOMER";

const Rtc = ({
  chatRoomId = "testChatroom",
  dealerYn,
  config: {
    SOCKET_URI,
    SOCKET_NAMESPACE,
    WEBRTC_URI,
    WEBRTC_SLAVE_URI,
    WEBRTC_PORT,
    WEBRTC_ROOM_URI,
    WEBRTC_PATH,
  },
}) => {
  const SERVER_URI: string = WEBRTC_URI;
  const SERVER_SLAVE_URI: string = WEBRTC_SLAVE_URI;
  const SERVER_PORT = parseInt(WEBRTC_PORT);

  const [cameraOnYn, setCameraOnYn] = useState<boolean>(true);
  const [micOnYn, setMicOnYn] = useState<boolean>(true);
  const [cardOpenedIndex, setCardOpenedIndex] = useState<number>(0);
  const [screenSharingYn, setScreenSharingYn] = useState<boolean>(false);

  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [peerId, setPeerId] = useState<any>();
  const [destination, setDestination] = useState<any>();
  const [mediaConnection, setMediaConnection] =
    useState<MediaConnection | null>();

  const [finding, setFinding] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [local, setLocal] = useState<Peer | null>();
  const [mediaDevices, setMediaDevices] = useState<MediaDevices | null>();
  const [peerErrorMessage, setPeerErrorMessage] = useState<string | null>();
  const [streamCameraErrored, setStreamCameraErrored] = useState<boolean>();
  const [streamMicErrored, setStreamMicErrored] = useState<boolean>();

  const [networkErrored, setNetworkErrored] = useState<boolean>(false);
  const [networkOnline, setNetworkOnline] = useState<boolean>(navigator.onLine);

  // modal errored
  const [peerModalErrorMessage, setPeerModalErrorMessage] = useState<string>();

  const [customerMicOnYn, setCustomerMicOnYn] = useState<boolean>(true);
  const [customerCameraOnYn, setCustomerCameraOnYn] = useState<boolean>(true);
  const [customerLeftYn, setCustomerLeftYn] = useState<boolean>(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>();
  const [leftYn, setLeftYn] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Moment>();
  const [timeDiff, setTimeDiff] = useState<number>(0);

  const userType: UserType = dealerYn ? "DEALER" : "CUSTOMER";

  const playerRef = useRef<HTMLVideoElement>();
  const remotePlayerRef = useRef<HTMLVideoElement>();

  const peerMaster = {
    host: SERVER_URI,
    path: WEBRTC_PATH,
    port: SERVER_PORT,
    secure: true,
    debug: process.env.NEXT_PUBLIC_ENV_NODE_ENV === "development" ? 3 : 1,
    config: {
      iceServers: [
        { urls: ["stun:stun01.sipphone.com"] },
        { urls: ["stun:stun.ekiga.net"] },
        { urls: ["stun:stunserver.org"] },
        { urls: ["stun:stun.softjoys.com"] },
        { urls: ["stun:stun.voiparound.com"] },
        { urls: ["stun:stun.voipbuster.com"] },
        { urls: ["stun:stun.voipstunt.com"] },
        { urls: ["stun:stun.voxgratia.org"] },
        { urls: ["stun:stun.xten.com"] },
        { urls: ["stun:stun.1und1.de:3478"] },
        { urls: ["stun:stun.2talk.co.nz:3478"] },
        { urls: ["stun:stun.2talk.com:3478"] },
        { urls: ["stun:stun.3clogic.com:3478"] },
        { urls: ["stun:stun.3cx.com:3478"] },
        { urls: ["stun:stun.a-mm.tv:3478"] },
        { urls: ["stun:stun.aa.net.uk:3478"] },
        { urls: ["stun:stun.acrobits.cz:3478"] },
        { urls: ["stun:stun.actionvoip.com:3478"] },
        { urls: ["stun:stun.advfn.com:3478"] },
        { urls: ["stun:stun.aeta-audio.com:3478"] },
        { urls: ["stun:stun.aeta.com:3478"] },
        { urls: ["stun:stun.alltel.com.au:3478"] },
        { urls: ["stun:stun.altar.com.pl:3478"] },
        { urls: ["stun:stun.annatel.net:3478"] },
        { urls: ["stun:stun.antisip.com:3478"] },
        { urls: ["stun:stun.arbuz.ru:3478"] },
        { urls: ["stun:stun.avigora.com:3478"] },
        { urls: ["stun:stun.avigora.fr:3478"] },
        { urls: ["stun:stun.awa-shima.com:3478"] },
        { urls: ["stun:stun.awt.be:3478"] },
        { urls: ["stun:stun.b2b2c.ca:3478"] },
        { urls: ["stun:stun.bahnhof.net:3478"] },
        { urls: ["stun:stun.barracuda.com:3478"] },
        { urls: ["stun:stun.bluesip.net:3478"] },
        { urls: ["stun:stun.bmwgs.cz:3478"] },
        { urls: ["stun:stun.botonakis.com:3478"] },
        { urls: ["stun:stun.budgetphone.nl:3478"] },
        { urls: ["stun:stun.budgetsip.com:3478"] },
        { urls: ["stun:stun.cablenet-as.net:3478"] },
        { urls: ["stun:stun.callromania.ro:3478"] },
        { urls: ["stun:stun.callwithus.com:3478"] },
        { urls: ["stun:stun.cbsys.net:3478"] },
        { urls: ["stun:stun.chathelp.ru:3478"] },
        { urls: ["stun:stun.cheapvoip.com:3478"] },
        { urls: ["stun:stun.ciktel.com:3478"] },
        { urls: ["stun:stun.cloopen.com:3478"] },
        { urls: ["stun:stun.colouredlines.com.au:3478"] },
        { urls: ["stun:stun.comfi.com:3478"] },
        { urls: ["stun:stun.commpeak.com:3478"] },
        { urls: ["stun:stun.comtube.com:3478"] },
        { urls: ["stun:stun.comtube.ru:3478"] },
        { urls: ["stun:stun.cope.es:3478"] },
        { urls: ["stun:stun.counterpath.com:3478"] },
        { urls: ["stun:stun.counterpath.net:3478"] },
        { urls: ["stun:stun.cryptonit.net:3478"] },
        { urls: ["stun:stun.darioflaccovio.it:3478"] },
        { urls: ["stun:stun.datamanagement.it:3478"] },
        { urls: ["stun:stun.dcalling.de:3478"] },
        { urls: ["stun:stun.decanet.fr:3478"] },
        { urls: ["stun:stun.demos.ru:3478"] },
        { urls: ["stun:stun.develz.org:3478"] },
        { urls: ["stun:stun.dingaling.ca:3478"] },
        { urls: ["stun:stun.doublerobotics.com:3478"] },
        { urls: ["stun:stun.drogon.net:3478"] },
        { urls: ["stun:stun.duocom.es:3478"] },
        { urls: ["stun:stun.dus.net:3478"] },
        { urls: ["stun:stun.e-fon.ch:3478"] },
        { urls: ["stun:stun.easybell.de:3478"] },
        { urls: ["stun:stun.easycall.pl:3478"] },
        { urls: ["stun:stun.easyvoip.com:3478"] },
        { urls: ["stun:stun.efficace-factory.com:3478"] },
        { urls: ["stun:stun.einsundeins.com:3478"] },
        { urls: ["stun:stun.einsundeins.de:3478"] },
        { urls: ["stun:stun.ekiga.net:3478"] },
        { urls: ["stun:stun.epygi.com:3478"] },
        { urls: ["stun:stun.etoilediese.fr:3478"] },
        { urls: ["stun:stun.eyeball.com:3478"] },
        { urls: ["stun:stun.faktortel.com.au:3478"] },
        { urls: ["stun:stun.freecall.com:3478"] },
        { urls: ["stun:stun.freeswitch.org:3478"] },
        { urls: ["stun:stun.freevoipdeal.com:3478"] },
        { urls: ["stun:stun.fuzemeeting.com:3478"] },
        { urls: ["stun:stun.gmx.de:3478"] },
        { urls: ["stun:stun.gmx.net:3478"] },
        { urls: ["stun:stun.gradwell.com:3478"] },
        { urls: ["stun:stun.halonet.pl:3478"] },
        { urls: ["stun:stun.hellonanu.com:3478"] },
        { urls: ["stun:stun.hoiio.com:3478"] },
        { urls: ["stun:stun.hosteurope.de:3478"] },
        { urls: ["stun:stun.ideasip.com:3478"] },
        { urls: ["stun:stun.imesh.com:3478"] },
        { urls: ["stun:stun.infra.net:3478"] },
        { urls: ["stun:stun.internetcalls.com:3478"] },
        { urls: ["stun:stun.intervoip.com:3478"] },
        { urls: ["stun:stun.ipcomms.net:3478"] },
        { urls: ["stun:stun.ipfire.org:3478"] },
        { urls: ["stun:stun.ippi.fr:3478"] },
        { urls: ["stun:stun.ipshka.com:3478"] },
        { urls: ["stun:stun.iptel.org:3478"] },
        { urls: ["stun:stun.irian.at:3478"] },
        { urls: ["stun:stun.it1.hr:3478"] },
        { urls: ["stun:stun.ivao.aero:3478"] },
        { urls: ["stun:stun.jappix.com:3478"] },
        { urls: ["stun:stun.jumblo.com:3478"] },
        { urls: ["stun:stun.justvoip.com:3478"] },
        { urls: ["stun:stun.kanet.ru:3478"] },
        { urls: ["stun:stun.kiwilink.co.nz:3478"] },
        { urls: ["stun:stun.kundenserver.de:3478"] },
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: ["stun:stun.linea7.net:3478"] },
        { urls: ["stun:stun.linphone.org:3478"] },
        { urls: ["stun:stun.liveo.fr:3478"] },
        { urls: ["stun:stun.lowratevoip.com:3478"] },
        { urls: ["stun:stun.lugosoft.com:3478"] },
        { urls: ["stun:stun.lundimatin.fr:3478"] },
        { urls: ["stun:stun.magnet.ie:3478"] },
        { urls: ["stun:stun.manle.com:3478"] },
        { urls: ["stun:stun.mgn.ru:3478"] },
        { urls: ["stun:stun.mit.de:3478"] },
        { urls: ["stun:stun.mitake.com.tw:3478"] },
        { urls: ["stun:stun.miwifi.com:3478"] },
        { urls: ["stun:stun.modulus.gr:3478"] },
        { urls: ["stun:stun.mozcom.com:3478"] },
        { urls: ["stun:stun.myvoiptraffic.com:3478"] },
        { urls: ["stun:stun.mywatson.it:3478"] },
        { urls: ["stun:stun.nas.net:3478"] },
        { urls: ["stun:stun.neotel.co.za:3478"] },
        { urls: ["stun:stun.netappel.com:3478"] },
        { urls: ["stun:stun.netappel.fr:3478"] },
        { urls: ["stun:stun.netgsm.com.tr:3478"] },
        { urls: ["stun:stun.nfon.net:3478"] },
        { urls: ["stun:stun.noblogs.org:3478"] },
        { urls: ["stun:stun.noc.ams-ix.net:3478"] },
        { urls: ["stun:stun.node4.co.uk:3478"] },
        { urls: ["stun:stun.nonoh.net:3478"] },
        { urls: ["stun:stun.nottingham.ac.uk:3478"] },
        { urls: ["stun:stun.nova.is:3478"] },
        { urls: ["stun:stun.nventure.com:3478"] },
        { urls: ["stun:stun.on.net.mk:3478"] },
        { urls: ["stun:stun.ooma.com:3478"] },
        { urls: ["stun:stun.ooonet.ru:3478"] },
        { urls: ["stun:stun.oriontelekom.rs:3478"] },
        { urls: ["stun:stun.outland-net.de:3478"] },
        { urls: ["stun:stun.ozekiphone.com:3478"] },
        { urls: ["stun:stun.patlive.com:3478"] },
        { urls: ["stun:stun.personal-voip.de:3478"] },
        { urls: ["stun:stun.petcube.com:3478"] },
        { urls: ["stun:stun.phone.com:3478"] },
        { urls: ["stun:stun.phoneserve.com:3478"] },
        { urls: ["stun:stun.pjsip.org:3478"] },
        { urls: ["stun:stun.poivy.com:3478"] },
        { urls: ["stun:stun.powerpbx.org:3478"] },
        { urls: ["stun:stun.powervoip.com:3478"] },
        { urls: ["stun:stun.ppdi.com:3478"] },
        { urls: ["stun:stun.prizee.com:3478"] },
        { urls: ["stun:stun.qq.com:3478"] },
        { urls: ["stun:stun.qvod.com:3478"] },
        { urls: ["stun:stun.rackco.com:3478"] },
        { urls: ["stun:stun.rapidnet.de:3478"] },
        { urls: ["stun:stun.rb-net.com:3478"] },
        { urls: ["stun:stun.refint.net:3478"] },
        { urls: ["stun:stun.remote-learner.net:3478"] },
        { urls: ["stun:stun.rixtelecom.se:3478"] },
        { urls: ["stun:stun.rockenstein.de:3478"] },
        { urls: ["stun:stun.rolmail.net:3478"] },
        { urls: ["stun:stun.rounds.com:3478"] },
        { urls: ["stun:stun.rynga.com:3478"] },
        { urls: ["stun:stun.samsungsmartcam.com:3478"] },
        { urls: ["stun:stun.schlund.de:3478"] },
        { urls: ["stun:stun.services.mozilla.com:3478"] },
        { urls: ["stun:stun.sigmavoip.com:3478"] },
        { urls: ["stun:stun.sip.us:3478"] },
        { urls: ["stun:stun.sipdiscount.com:3478"] },
        { urls: ["stun:stun.sipgate.net:10000"] },
        { urls: ["stun:stun.sipgate.net:3478"] },
        { urls: ["stun:stun.siplogin.de:3478"] },
        { urls: ["stun:stun.sipnet.net:3478"] },
        { urls: ["stun:stun.sipnet.ru:3478"] },
        { urls: ["stun:stun.siportal.it:3478"] },
        { urls: ["stun:stun.sippeer.dk:3478"] },
        { urls: ["stun:stun.siptraffic.com:3478"] },
        { urls: ["stun:stun.skylink.ru:3478"] },
        { urls: ["stun:stun.sma.de:3478"] },
        { urls: ["stun:stun.smartvoip.com:3478"] },
        { urls: ["stun:stun.smsdiscount.com:3478"] },
        { urls: ["stun:stun.snafu.de:3478"] },
        { urls: ["stun:stun.softjoys.com:3478"] },
        { urls: ["stun:stun.solcon.nl:3478"] },
        { urls: ["stun:stun.solnet.ch:3478"] },
        { urls: ["stun:stun.sonetel.com:3478"] },
        { urls: ["stun:stun.sonetel.net:3478"] },
        { urls: ["stun:stun.sovtest.ru:3478"] },
        { urls: ["stun:stun.speedy.com.ar:3478"] },
        { urls: ["stun:stun.spokn.com:3478"] },
        { urls: ["stun:stun.srce.hr:3478"] },
        { urls: ["stun:stun.ssl7.net:3478"] },
        { urls: ["stun:stun.stunprotocol.org:3478"] },
        { urls: ["stun:stun.symform.com:3478"] },
        { urls: ["stun:stun.symplicity.com:3478"] },
        { urls: ["stun:stun.sysadminman.net:3478"] },
        { urls: ["stun:stun.t-online.de:3478"] },
        { urls: ["stun:stun.tagan.ru:3478"] },
        { urls: ["stun:stun.tatneft.ru:3478"] },
        { urls: ["stun:stun.teachercreated.com:3478"] },
        { urls: ["stun:stun.tel.lu:3478"] },
        { urls: ["stun:stun.telbo.com:3478"] },
        { urls: ["stun:stun.telefacil.com:3478"] },
        { urls: ["stun:stun.tis-dialog.ru:3478"] },
        { urls: ["stun:stun.tng.de:3478"] },
        { urls: ["stun:stun.twt.it:3478"] },
        { urls: ["stun:stun.u-blox.com:3478"] },
        { urls: ["stun:stun.ucallweconn.net:3478"] },
        { urls: ["stun:stun.ucsb.edu:3478"] },
        { urls: ["stun:stun.ucw.cz:3478"] },
        { urls: ["stun:stun.uls.co.za:3478"] },
        { urls: ["stun:stun.unseen.is:3478"] },
        { urls: ["stun:stun.usfamily.net:3478"] },
        { urls: ["stun:stun.veoh.com:3478"] },
        { urls: ["stun:stun.vidyo.com:3478"] },
        { urls: ["stun:stun.vipgroup.net:3478"] },
        { urls: ["stun:stun.virtual-call.com:3478"] },
        { urls: ["stun:stun.viva.gr:3478"] },
        { urls: ["stun:stun.vivox.com:3478"] },
        { urls: ["stun:stun.vline.com:3478"] },
        { urls: ["stun:stun.vo.lu:3478"] },
        { urls: ["stun:stun.vodafone.ro:3478"] },
        { urls: ["stun:stun.voicetrading.com:3478"] },
        { urls: ["stun:stun.voip.aebc.com:3478"] },
        { urls: ["stun:stun.voip.blackberry.com:3478"] },
        { urls: ["stun:stun.voip.eutelia.it:3478"] },
        { urls: ["stun:stun.voiparound.com:3478"] },
        { urls: ["stun:stun.voipblast.com:3478"] },
        { urls: ["stun:stun.voipbuster.com:3478"] },
        { urls: ["stun:stun.voipbusterpro.com:3478"] },
        { urls: ["stun:stun.voipcheap.co.uk:3478"] },
        { urls: ["stun:stun.voipcheap.com:3478"] },
        { urls: ["stun:stun.voipfibre.com:3478"] },
        { urls: ["stun:stun.voipgain.com:3478"] },
        { urls: ["stun:stun.voipgate.com:3478"] },
        { urls: ["stun:stun.voipinfocenter.com:3478"] },
        { urls: ["stun:stun.voipplanet.nl:3478"] },
        { urls: ["stun:stun.voippro.com:3478"] },
        { urls: ["stun:stun.voipraider.com:3478"] },
        { urls: ["stun:stun.voipstunt.com:3478"] },
        { urls: ["stun:stun.voipwise.com:3478"] },
        { urls: ["stun:stun.voipzoom.com:3478"] },
        { urls: ["stun:stun.vopium.com:3478"] },
        { urls: ["stun:stun.voxgratia.org:3478"] },
        { urls: ["stun:stun.voxox.com:3478"] },
        { urls: ["stun:stun.voys.nl:3478"] },
        { urls: ["stun:stun.voztele.com:3478"] },
        { urls: ["stun:stun.vyke.com:3478"] },
        { urls: ["stun:stun.webcalldirect.com:3478"] },
        { urls: ["stun:stun.whoi.edu:3478"] },
        { urls: ["stun:stun.wifirst.net:3478"] },
        { urls: ["stun:stun.wwdl.net:3478"] },
        { urls: ["stun:stun.xs4all.nl:3478"] },
        { urls: ["stun:stun.xtratelecom.es:3478"] },
        { urls: ["stun:stun.yesss.at:3478"] },
        { urls: ["stun:stun.zadarma.com:3478"] },
        { urls: ["stun:stun.zadv.com:3478"] },
        { urls: ["stun:stun.zoiper.com:3478"] },
        { urls: ["stun:stun1.faktortel.com.au:3478"] },
        { urls: ["stun:stun1.l.google.com:19302"] },
        { urls: ["stun:stun1.voiceeclipse.net:3478"] },
        { urls: ["stun:stun2.l.google.com:19302"] },
        { urls: ["stun:stun3.l.google.com:19302"] },
        { urls: ["stun:stun4.l.google.com:19302"] },
        { urls: ["stun:stunserver.org:3478"] },
        {
          urls: ["turn:20.56.33.118:3478"],
          username: "turnuser",
          credential: "Wonder9595",
          credentialType: "password",
        },
        {
          // urls: ['turn:51.116.99.76:3478'],
          urls: [
            "turn:webrtcwondermove.germanywestcentral.cloudapp.azure.com:443?transport=tcp",
          ],
          username: "turnuser",
          credential: "Wonder9595",
          credentialType: "password",
        },
        {
          urls: ["turn:20.39.188.117:3478"],
          username: "turnuser",
          credential: "Wonder9595",
          credentialType: "password",
        },
      ],
    },
  };
  const peerSlave = { ...peerMaster, host: SERVER_SLAVE_URI };

  /**
   * 1. 딜ㄹ러 입장 시 로컬스트림 켜짐
   * 2. 접속 시 소켓 또는 알디 연동
   * 3. customerJoinYn 값 필요 -
   *  - true이면
   *
   */
  // 함수들 ~
  const setLocalStreamVideo = useCallback(async () => {
    try {
      if (navigator.mediaDevices) {
        let s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(s);
      }
    } catch (e) {
      console.error(e);
    }
  }, [mediaDevices, cameraOnYn, micOnYn, localStream]);
  const setMediaStreamVideo = useCallback(async () => {
    try {
      if (navigator.mediaDevices) {
        let s = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        let stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        s.addTrack(stream.getAudioTracks()[0]);

        s.addEventListener("inactive", function (e) {
          console.log("local inactive");
          // setMicOnYn(false);
          // setCameraOnYn(false);
        });
        s.addEventListener("active", function (e) {
          console.log("local active");
          setMicOnYn(true);
          setCameraOnYn(true);
        });
        s.getVideoTracks().forEach((i) => {
          i.addEventListener("mute", function (e) {
            console.log("local camera muted!");
            // setCameraOnYn(false);
            // setConnectError(true);
          });
          i.addEventListener("unmute", function (e) {
            console.log("local camera unmuted!");
            // setCameraOnYn(true);
            // setConnectError(true);
          });
        });

        s.getAudioTracks().forEach((i) => {
          i.addEventListener("mute", function (e) {
            console.log("local mic muted!");
            setMicOnYn(false);
            // setConnectError(true);
          });
          i.addEventListener("unmute", function (e) {
            console.log("local mic unmuted!");
            setMicOnYn(true);
            // setConnectError(true);
          });
        });

        setLocalStream(s);
      }
    } catch (e) {
      console.error(e);
    }
  }, [mediaDevices, cameraOnYn, micOnYn, localStream]);

  const findDestination = useCallback(async () => {
    if (chatRoomId == null) return alert("please enter chatroom id");
    try {
      setFinding(true);
      console.log("peerId", peerId);
      let response = await axios.get(`${WEBRTC_ROOM_URI}/peers/room`, {
        params: {
          roomId: chatRoomId,
          userType: userType.toLowerCase(),
          peerId: peerId,
        },
      });
      let {
        data: { room },
      } = response;
      console.log("found destination: ", room);

      if (userType === "CUSTOMER") {
        if (room?.manager) {
          setDestination(room.manager);
        }
      } else {
        if (room?.customer) {
          setDestination(room.customer);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFinding(false);
    }
  }, [chatRoomId, userType, peerId]);

  const connect = useCallback(() => {
    console.log(`Connecting to ${destination}...`);
    setConnecting(true);
    try {
      if (!local) throw new Error("localPeer not defined");
      if (!destination) throw new Error("destination not defined");

      let conn = local.connect(destination);
      conn.on("data", (data) => {
        setConnected(true);
        setConnecting(false);
        console.log(`received: ${data}`);
      });
      conn.on("open", () => {
        setConnected(true);
        setConnecting(false);
      });
      conn.on("error", (e) => {
        console.log("connect error", e);
        setConnected(false);
        setConnecting(false);
      });
    } catch (e) {
      console.log("connect error 2", e);
    } finally {
      setConnecting(false);
    }
  }, [destination, local]);

  const handleStream = useCallback(
    (stream) => {
      setStartTime((prev) => prev || moment());
      console.log("navis calling 2 aaa", stream);
      // `stream` is the MediaStream of the remote peer.m
      // Here you'd add it to an HTML video/canvas element.

      setRemoteStream(stream);
    },
    [localStream]
  );

  const startCall = useCallback(() => {
    console.log("method startCall() called", local, destination, localStream);

    if (!local) throw new Error("localPeer not defined");
    if (!destination) throw new Error("destination not defined");
    if (!localStream) throw new Error("destination not defined");

    local.on("call", (call) => {
      console.log("localPeer has received call");
      console.log("localStream is ", localStream);
      // Answer the call, providing our mediaStream
      if (localStream != null) {
        // console.log('navis calling aaa', localStream);
        call.answer(localStream);
        call.on("stream", function (stream) {
          handleStream(stream);
        });
        call.on("close", function () {
          setRemoteStream(null);
        });
        call.on("error", function (e) {
          console.log(e);
          setRemoteStream(null);
          setConnected(false);
        });
      }
    });
    try {
      let call = local.call(destination, localStream);
      call?.on("stream", function (stream) {
        handleStream(stream);
      });
      console.log(call);
      call.on("error", (e) => {
        console.log("call connection errored", e);
      });
      call.on("close", () => {
        console.log("call connection closed");
      });
      setMediaConnection(call);
    } catch (e) {
      setConnected(false);
      console.log(e);
    } finally {
      setConnecting(false);
    }
  }, [local, destination, localStream, remoteStream]);

  const stop = useCallback(() => {
    console.log("stop", localStream, remoteStream);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
          localStream?.removeTrack(track);
          console.log("track stopped");
        });
      });

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        // track.stop();
        track.stop();
        localStream.removeTrack(track);
      });
      setLocalStream(null);
    }
    if (local) local.disconnect();
    if (mediaConnection) mediaConnection.close();
    if (remoteStream) {
      // localStream.removeTrack(); // localStream.release();
      remoteStream.getTracks().forEach((track) => {
        track.stop();
        remoteStream.removeTrack(track);
      });
      setRemoteStream(null);
    }
    setPeerId(null);
    setDestination(null);
  }, [localStream, remoteStream, local, mediaConnection]);

  const leaveSocket = useCallback(() => {
    console.log("leave");
    socketInstance?.emit("leave", { roomId: chatRoomId, sender: "DEALER" });
    setLeftYn(true);
  }, [socketInstance, chatRoomId]);

  // ** Hooks
  useEffect(() => {
    let socket: Socket;
    console.log("socket icandoit");
    (async () => {
      socket = await socketInitializer(chatRoomId);
    })();
    return () => {
      console.log("socket off");
      if (socket) {
        // socket.emit('leave', { roomId: chatRoomId, sender: 'DEALER' });
        socket.disconnect();
      }
    };
  }, [connected]);

  //** Socket Initializer
  const socketInitializer = async (_id) => {
    // We just call it because we don't need anything else out of it
    // await fetch('/');
    const manager = new Manager(SOCKET_URI, { transports: ["websocket"] });
    const socket = manager.socket(SOCKET_NAMESPACE); // main namespace

    socket.on("connect", () => {
      console.log(`socket join, { roomId: ${_id}, sender: 'DEALER' }`);
      socket.emit("join", { roomId: _id, sender: "DEALER" });
      console.log(micOnYn, cameraOnYn);
      socket.emit("microphone", {
        roomId: _id,
        sender: "DEALER",
        onYn: micOnYn,
      });
      socket.emit("camera", {
        roomId: _id,
        sender: "DEALER",
        onYn: cameraOnYn,
      });
    });
    socket.on("microphone", ({ roomId, sender, onYn }) => {
      const isMe: boolean = sender === "DEALER";
      if (!isMe) {
        console.log("socket mic listener onYn : ", onYn);
        setCustomerMicOnYn(onYn);
      }
    });
    socket.on("camera", ({ roomId, sender, onYn }) => {
      const isMe: boolean = sender === "DEALER";
      if (!isMe) {
        console.log("socket camera listener onYn : ", onYn);
        setCustomerCameraOnYn(onYn);
      }
    });
    socket.on("leave", ({ roomId, sender }) => {
      const isMe: boolean = sender === "DEALER";
      console.log("leave", sender);
      if (!isMe) {
        setCustomerLeftYn(true);
      } else {
        setLeftYn(true);
      }
    });
    socket.on("consultError", ({ consultId, sender }) => {
      const isMe: boolean = sender === "DEALER";
      if (!isMe) {
        // onRefresh();
        setNetworkErrored(true);
      }
    });
    setSocketInstance(socket);
    return socket;
  };

  // 1. 딜러 입장 시 로컬스트림 세팅
  useEffect(() => {
    console.log("1. 딜러 입장 시 로컬스트림 세팅", localStream);
    if (localStream == null) {
      setLocalStreamVideo();
    }
    return () => {
      console.log("aa=====");
      stop();
    };
  }, []);

  useEffect(() => {
    if (localStream && socketInstance) {
      if (localStream.getVideoTracks()) {
        localStream.getVideoTracks()[0].enabled = cameraOnYn;
        console.log("camera on? off? " + cameraOnYn);
        socketInstance.emit("camera", {
          roomId: chatRoomId,
          sender: "DEALER",
          onYn: cameraOnYn,
        });
      }
    }
  }, [cameraOnYn]);

  useEffect(() => {
    if (localStream && socketInstance) {
      if (localStream.getAudioTracks()?.length > 0) {
        localStream.getAudioTracks()[0].enabled = micOnYn;
        console.log("mic on? off? " + micOnYn);
        socketInstance.emit("microphone", {
          roomId: chatRoomId,
          sender: "DEALER",
          onYn: micOnYn,
        });
      }
    }
  }, [micOnYn]);

  // test 용으로 추가
  useEffect(() => {
    if (remoteStream) {
      if (remoteStream.getVideoTracks()?.length > 0) {
        remoteStream.getVideoTracks()[0].enabled = customerCameraOnYn;
        console.log("remote camera on? off? " + customerCameraOnYn);
      }
    }
  }, [customerCameraOnYn]);

  // test 용으로 추가
  useEffect(() => {
    if (remoteStream) {
      if (remoteStream.getAudioTracks()?.length > 0) {
        remoteStream.getAudioTracks()[0].enabled = customerMicOnYn;
        console.log("remote mic on? off? " + customerMicOnYn);
      }
    }
  }, [customerMicOnYn]);

  // // 2. 로컬 Peer id 받고
  useEffect(() => {
    console.log("로컬 peerid 세팅을 시작", peerId);
    if (peerId == null) {
      import("peerjs")
        .then(({ default: Peer }) => {
          console.log("peerjs import");
          // normal synchronous code

          const localPeer = new Peer(peerMaster);
          setLocal(localPeer);

          console.log("localPeer", localPeer);
        })
        .catch((e) => {
          console.error(e);
        });
    }
    return () => {
      setLocal(null);
    };
  }, []);

  useEffect(() => {
    console.log("local peer changed");
    if (local) {
      local.on("open", (localPeerId) => {
        console.log("Local peer open with ID", localPeerId);
        setPeerId(localPeerId);
      });
      local.on("connection", (conn) => {
        console.log("Local peer has received connection.");
        setConnected(true);
        setConnecting(false);
        setPeerErrorMessage(null);
        setNetworkErrored(false);
        // setDestination()
        setDestination(conn.peer);
        conn.on("error", (e) => {
          console.log(e);
          // setConnected(false);
          setConnecting(false);
        });
        conn.on("open", () => {
          setConnected(true);
          setConnecting(false);
          console.log("Local peer has opened connection.", conn.peer);
          // conn.on('data', (data) => console.log('Received from remote peer', data));
          console.log("Local peer sending data.");
          conn.send("Hello, this is the LOCAL peer!");
        });
      });
      local.on("call", (mediaConnection) => {
        console.log("local Peer on call ", mediaConnection);
        if (!destination) setDestination(mediaConnection.peer);
        mediaConnection.on("stream", function (stream) {
          handleStream(stream);
        });
      });
      local.on("close", () => {
        console.log("local Peer closed ");
      });
      local.on("disconnected", () => {
        console.log(
          "Local peer disconnected. trying to connect using slave server."
        );
        console.log("setlocal start");
        const peer = new Peer(peerSlave);
        setLocal(peer);
        console.log("setlocal called");
      });
      local.on("error", (e) => {
        console.log("Local peer has got errored ", e);
        if (e["type"] === "network") {
          // modal 출력
          setNetworkErrored(true);
        }
        setPeerErrorMessage(
          "An error has occured while connecting. ECODE: " + e["type"]
        );

        // console.log(this.state.myId, 'peer.eeror', error.type);
        // var interval = setTimeout(function () {
        //   if (localPeer.open === true || localPeer.destroyed === true) {
        //     clearInterval(interval);
        //   } else {
        //     localPeer.reconnect();
        //   }
        // }, 5000);
      });
    }
  }, [local]);
  // 3. 받아온 peer id를  rtc 서버에 등록하고, 상대방 아이디가 있는지 확인함
  useEffect(() => {
    if (peerId) {
      console.log("peerid: ", peerId, ", finding destination");
      findDestination();
    }
  }, [peerId]);

  // 4. 상대방 아이디 있으면 연결한다.
  useEffect(() => {
    if (destination) {
      console.log("destination found: ", destination, ", trying to connect");
      connect();
    }
  }, [destination]);

  useEffect(() => {
    if (localStream) {
      setCameraOnYn(true);
      setMicOnYn(true);
    } else {
    }
  }, [localStream]);
  useEffect(() => {
    if (remoteStream) {
      remoteStream?.addEventListener("inactive", function (e) {
        console.log("remote inactive");
        setStreamCameraErrored(true);
        setStreamMicErrored(true);
        // setCustomerCameraOnYn(false);
        // setCustomerMicOnYn(false);
      });
      remoteStream?.addEventListener("active", function (e) {
        console.log("remote active");
        setStreamCameraErrored(false);
        setStreamMicErrored(false);
      });
      if (remoteStream.getVideoTracks().length > 0) {
        console.log(remoteStream.getVideoTracks());
        remoteStream
          ?.getVideoTracks()[0]
          ?.addEventListener("mute", function (e) {
            console.log("remote camera muted!");
            setStreamCameraErrored(true);
            // setCustomerCameraOnYn(false);
            // setConnectError(true);
          });
        remoteStream
          ?.getVideoTracks()[0]
          ?.addEventListener("unmute", function (e) {
            console.log("remote camera unmuted!");
            setStreamCameraErrored(false);
            // setCustomerCameraOnYn(true);
            // setConnectError(true);
          });
      }
      if (remoteStream.getAudioTracks().length > 0) {
        remoteStream
          .getAudioTracks()[0]
          ?.addEventListener("mute", function (e) {
            console.log("remote mic muted!");
            setStreamMicErrored(true);
            // setCustomerMicOnYn(false);
            // setConnectError(true);
          });
        remoteStream
          .getAudioTracks()[0]
          ?.addEventListener("unmute", function (e) {
            console.log("remote mic unmuted!");
            setStreamMicErrored(false);
            // setCustomerMicOnYn(true);
            // setConnectError(true);
          });
      }
    } else {
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream && destination && local) {
      if (connected && userType === "DEALER") startCall();
    }
  }, [local, destination, localStream]);

  // 5. 연결됐으면 call 후 remoteStream을 받아온다.
  useEffect(() => {
    if (connected && userType === "DEALER") {
      console.log("connected!");
      startCall();
    }
  }, [connected]);

  useEffect(() => {
    console.log("screensharing", screenSharingYn);
    if (screenSharingYn) {
      setMediaStreamVideo();
    } else {
      setLocalStreamVideo();
    }
  }, [screenSharingYn]);

  useEffect(() => {
    // console.log('remoteStream : ', remoteStream);
    if (remotePlayerRef.current && remoteStream)
      remotePlayerRef.current.srcObject = remoteStream ? remoteStream : null;

    return () => {
      if (remotePlayerRef.current) {
        (remotePlayerRef.current.srcObject as MediaStream)
          ?.getTracks()
          .forEach((track) => {
            track.stop();
          });
        remotePlayerRef.current.srcObject = null;
      }
    };
  }, [remoteStream]);

  useEffect(() => {
    // console.log('localstream : ', localStream);
    if (playerRef.current && localStream)
      playerRef.current.srcObject = localStream ? localStream : null;

    return () => {
      if (playerRef.current) {
        (playerRef.current.srcObject as MediaStream)
          ?.getTracks()
          .forEach((track) => {
            track.stop();
          });
        playerRef.current.srcObject = null;
      }
    };
  }, [localStream]);

  useEffect(() => {
    // return ()=>{
    //   stop();
    //   playerRef.current?.pause();
    //   remotePlayerRef.current?.pause();
    // }
  });

  useEffect(() => {
    setNetworkOnline(navigator.onLine);
  }, [navigator.onLine]);

  useEffect(() => {
    if (networkOnline) {
      // onRefresh();
      // setNetworkErrored(false);
    } else {
      // setConnecting(true);
      // setTimeout(() => {
      console.log("offline");
      setNetworkErrored(true);
      // }, 1500);
    }
  }, [networkOnline]);

  const onRefresh = useCallback(() => {
    setNetworkErrored(false);
    if (!networkOnline) {
      setTimeout(() => {
        setNetworkErrored(true);
      }, 1500);
      return;
    } else {
      findDestination();
    }
  }, [networkOnline]);

  useEffect(() => {
    if (networkErrored && socketInstance) {
      socketInstance?.emit("consultError", {
        consultId: chatRoomId,
        sender: "DEALER",
      });
    }
  }, [networkErrored]);
  // // 얜 뭐지
  // useEffect(() => {
  //   setFinding(false);
  //   setConnected(false);
  //   setConnecting(false);
  //   setRemoteStream(null);
  // }, [destination, peerId]);

  useEffect(() => {
    if (startTime) {
      let interval = setInterval(() => {
        setTimeDiff(moment().diff(startTime, "seconds"));
      }, 1000);
      return () => {
        setTimeDiff(0);
        clearInterval(interval);
      };
    }
  }, [startTime]);

  const mediaStatus = useMemo(
    () => ({
      cameraOnYn,
      micOnYn,
      screenSharingYn,
      customerMicOnYn,
      customerCameraOnYn,
    }),
    [cameraOnYn, micOnYn, screenSharingYn, customerMicOnYn, customerCameraOnYn]
  );
  const connectStatus = useMemo(
    () => ({
      connecting,
      connected,
      finding,
      peerId,
      destination,
      customerLeftYn,
      leftYn,
      timeDiff,
      peerErrorMessage,
      streamCameraErrored,
      streamMicErrored,
      networkErrored,
    }),
    [
      connecting,
      connected,
      finding,
      peerId,
      destination,
      customerLeftYn,
      leftYn,
      timeDiff,
      peerErrorMessage,
      streamCameraErrored,
      streamMicErrored,
      networkErrored,
    ]
  );
  const stream = useMemo(() => {
    return { localStream, remoteStream };
  }, [localStream, remoteStream]);

  return {
    mediaStatus,
    connectStatus,
    stream,
    setCameraOnYn,
    setMicOnYn,
    setScreenSharingYn,
    onStop: stop,
    onStart: setLocalStreamVideo,
    leaveSocket,
    onRefresh,
    socketInstance,
    player: {
      playerRef,
      remotePlayerRef,
    },
  };
};

export default Rtc;
