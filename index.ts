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
  cameraDefaultOnYn = true,
  micDefaultOnYn = true,
  config: {
    SOCKET_URI,
    SOCKET_NAMESPACE,
    WEBRTC_URI,
    WEBRTC_SLAVE_URI,
    WEBRTC_PORT,
    WEBRTC_ROOM_URI,
    WEBRTC_PATH,
    SIGNAL_SOCKET_URI,
    SIGNAL_SOCKET_NAMESPACE,
  },
}) => {
  const SERVER_URI: string = WEBRTC_URI;
  const SERVER_SLAVE_URI: string = WEBRTC_SLAVE_URI;
  const SERVER_PORT = parseInt(WEBRTC_PORT);

  const [cameraOnYn, setCameraOnYn] = useState<boolean>(cameraDefaultOnYn);
  const [micOnYn, setMicOnYn] = useState<boolean>(micDefaultOnYn);
  const [deviceChangeStartYn, setDeviceChangeStartYn] =
    useState<boolean>(false); //내가 changing 중인지
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
  const [local, setLocal] = useState<RTCPeerConnection | null>();
  const [mediaDevices, setMediaDevices] = useState<MediaDevices | null>();
  const [peerErrorMessage, setPeerErrorMessage] = useState<string | null>();
  const [streamCameraErrored, setStreamCameraErrored] = useState<boolean>();
  const [streamMicErrored, setStreamMicErrored] = useState<boolean>();

  const [networkErrored, setNetworkErrored] = useState<boolean>(false);
  const [networkOnline, setNetworkOnline] = useState<boolean>(navigator.onLine);

  const [deviceSwitchRequested, setDeviceSwitchRequested] =
    useState<boolean>(false);
  const [deviceSwitchSucceeded, setDeviceSwitchSucceeded] =
    useState<boolean>(false);
  const [deviceSwitchingYn, setDeviceSwitchingYn] = useState<boolean>(false); // 상대방이 changing 중인지

  // modal errored
  const [peerModalErrorMessage, setPeerModalErrorMessage] = useState<string>();

  const [customerMicOnYn, setCustomerMicOnYn] = useState<boolean>(true);
  const [customerCameraOnYn, setCustomerCameraOnYn] = useState<boolean>(true);
  const [customerLeftYn, setCustomerLeftYn] = useState<boolean>(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>();
  const [webRtcSocketInstance, setWebRtcSocketInstance] = useState<Socket>();
  const [remoteCandidates, setRemoteCandidates] = useState<any>([]);

  const [peerJoinYn, setPeerJoinYn] = useState<boolean>(false);

  const [leftYn, setLeftYn] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Moment>();
  const [timeDiff, setTimeDiff] = useState<number>(0);

  const [negotiationNeeded, setNegotiationNeeded] = useState<boolean>(false);
  const [answerNeeded, setAnswerNeeded] = useState<boolean>(false);

  /// 다시한번 시작해
  const userType: UserType = dealerYn ? "DEALER" : "CUSTOMER";

  const playerRef = useRef<HTMLVideoElement>();
  const remotePlayerRef = useRef<HTMLVideoElement>();
  const webRtcSocketRef = useRef<Socket>();
  const peerConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>();

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
  const socketRef = useRef<Socket>();

  useEffect(() => {
    //1)
    let socket: Socket;
    const localStream = new MediaStream();

    (async () => {
      const manager = new Manager(SOCKET_URI, { transports: ["websocket"] });
      socket = manager.socket(SOCKET_NAMESPACE); // main namespace
      const _id = chatRoomId;

      socket.on("connect", () => {
        console.log(
          `socket join, { roomId: ${_id}, sender: '${userType}', camera: ${cameraOnYn}, mic: ${micOnYn} }`
        );
        socket.emit("join", {
          roomId: _id,
          sender: userType,
          // cameraOnYn,
          // microphoneOnYn: micOnYn,
        });

        if (userType === "DEALER") {
          socket.emit("switchDevice", {
            roomId: _id,
            sender: userType,
            deviceType: "WEB",
            switchStatus: "SUCCESS",
          });
        }
      });
      socket.on("microphone", ({ roomId, sender, onYn }) => {
        const isMe: boolean = sender === userType;
        if (!isMe) {
          console.log("peer socket mic listener onYn : ", onYn);
          setCustomerMicOnYn(onYn);
        }
      });
      socket.on("camera", ({ roomId, sender, onYn }) => {
        const isMe: boolean = sender === userType;
        if (!isMe) {
          console.log("socket camera listener onYn : ", onYn);
          setCustomerCameraOnYn(onYn);
        }
      });
      socket.on("leave", ({ roomId, sender }) => {
        const isMe: boolean = sender === userType;
        console.log("leave", sender);
        if (!isMe) {
          setCustomerLeftYn(true);
        } else {
          setLeftYn(true);
        }
      });
      socket.on("consultError", ({ consultId, sender }) => {
        const isMe: boolean = sender === userType;
        if (!isMe) {
          // onRefresh();
          setNetworkErrored(true);
        }
      });
      socket.on(
        "switchDevice",
        ({ roomId, sender, deviceType, switchStatus }) => {
          if (sender === "DEALER") {
            if (userType === "CUSTOMER") {
              if (switchStatus === "ALLOW") {
                console.log("deviceSwitching:: allow socket received");
                onRefresh();
              }
            }
            if (userType === "DEALER") {
              if (switchStatus === "REQUEST" && deviceType === "MOBILE") {
                setDeviceSwitchRequested(true);
              }
              if (
                switchStatus === "SUCCESS" &&
                deviceType === "MOBILE" //&&
                // deviceSwitchingYn
              ) {
                // 끄기
                console.log(
                  "deviceSwitching:: success",
                  switchStatus,
                  sender,
                  deviceSwitchRequested,
                  deviceSwitchingYn
                );
                setDeviceSwitchSucceeded(true);
                setDeviceSwitchingYn(false);
              }

              if (switchStatus === "REJECT") {
                // 끄기
                console.log(
                  "deviceSwitching:: reject ",
                  switchStatus,
                  sender,
                  deviceSwitchRequested
                );
                setDeviceSwitchingYn(false); //필요한가?
              }
            }
          }
        }
      );
      socketRef.current = socket;
      localStreamRef.current = localStream;
      console.log("localstream", localStream);
    })();
    return () => {
      console.log("socket off");
      if (socket) {
        socket.disconnect();
        socketRef.current = undefined;
      }
      stop(deviceSwitchingYn);
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      console.log("playerref", playerRef.current, localStreamRef.current);
      playerRef.current.srcObject = localStreamRef.current;
    }
  }, [playerRef.current, localStreamRef.current]);

  useEffect(() => {
    //1)
    let socket: Socket;
    (async () => {
      const manager = new Manager(SIGNAL_SOCKET_URI, {
        transports: ["websocket", "polling"],
        secure: true,
      });
      socket = manager.socket(SIGNAL_SOCKET_NAMESPACE); // main nakmespace
      const _id = chatRoomId;

      socket.on("connect", () => {
        console.log("webrtc socket connected");
        socket.emit("join_room", { room: chatRoomId, sender: userType });
      });

      let candidates = [];
      socket.on("getCandidate", ({ candidate, sender }) => {
        try {
          const isMe = sender === userType;
          if (!isMe) {
            console.log(
              "getCandidate socket received - customer",
              candidate,
              peerConnectionRef.current.connectionState,
            );

            const newCandidate = new RTCIceCandidate(candidate);
            if (peerConnectionRef.current.signalingState == "closed") return;

            if (peerConnectionRef.current.remoteDescription) {
              if (newCandidate) {
                peerConnectionRef.current.addIceCandidate(newCandidate);
              }
            } else {
              candidates.push(newCandidate);
            }
          }
        } catch (e) {
          console.error("getCandidate ~ error ~", e);
        }
      });

      socket.on("all_users", (all_users) => {
        console.log("all_users socket received", all_users);
        const users = all_users.filter((i) => i.sender !== userType);
        const len = users.length;

        console.log("all_users length!!!", len);
        //* room에 두명 이상 있을 시 handshake 로직 시작
        if (userType === "DEALER") {
          if (len > 0) {
            setPeerJoinYn(true);
          }
        }
      });
      socket.on("disconnect", (reason) => {
        console.log("socket disconnected by", reason); // "ping timeout"
        // webRtcSocketRef.current = undefined;
        // socket.connect();
      });

      if (userType === "CUSTOMER") {
        socket.on("getOffer", async ({ sdp, sender }) => {
          const isMe = sender === userType;
          console.log("offer socket received", sdp, local);
          if (!isMe) {
            console.log(
              "peerconnection:: connectionstate ",
              peerConnectionRef.current.connectionState,
              deviceSwitchingYn
            );
            if (peerConnectionRef.current.signalingState == "closed") return;
            try {
              const offerDescription = new RTCSessionDescription(sdp);
              peerConnectionRef.current.setRemoteDescription(offerDescription);
            } catch (e) {
              console.log("error:", e, "deviceSwitching:", deviceSwitchingYn);
              if (deviceSwitchingYn) {
              }
            }
            setAnswerNeeded(true);

            try {
              if (candidates.length > 0) {
                candidates.map((i) => peerConnectionRef.current.addIceCandidate(i));
                candidates = [];
              }
            } catch (e) {}
          }
        });
      } else {
        socket.on("getAnswer", ({ sdp, sender }) => {
          console.log(
            "webrtc socket get Answer, local, offer",
            peerConnectionRef.current,
            sdp,
            sender
          );
          if (peerConnectionRef.current.signalingState == "closed") return;
          try {
            const isMe = sender === userType;
            if (!isMe) {
              console.log(
                "answer socket get",
                sdp,
                peerConnectionRef.current,
                candidates
              );
              const offerDescription = new RTCSessionDescription(sdp);
              peerConnectionRef.current.setRemoteDescription(offerDescription);
              if (candidates.length > 0) {
                candidates.map((i) => peerConnectionRef.current.addIceCandidate(i));
                candidates = [];
              }
            }
          } catch (e) {
            console.error("sendAnswer ~ error ~", e);
          }
        });
      }
      webRtcSocketRef.current = socket;
    })();

    return () => {
      console.log("socket off");
      if (socket) {
        socket.disconnect();
        webRtcSocketRef.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    console.log("answer needed Effect", answerNeeded, localStreamRef.current);
    if (answerNeeded && localStreamRef.current) {
      (async () => {
        const answerDescription =
          await peerConnectionRef.current.createAnswer();
        peerConnectionRef.current.setLocalDescription(answerDescription);

        console.log("send answer!!", peerConnectionRef.current);
        webRtcSocketRef.current.emit("answer", {
          sdp: answerDescription,
          sender: userType,
        });
        setAnswerNeeded(false);
      })();
    }
  }, [answerNeeded, localStreamRef.current]);

  useEffect(() => {
    if (webRtcSocketRef.current) {
      const peerConnection = initPeerConnection();
      peerConnectionRef.current = peerConnection;
      return () => {
        console.log("peerConnection: close");
        peerConnection.close();
        peerConnectionRef.current = undefined;
        setNegotiationNeeded(false);
        setPeerJoinYn(false);
      };
    }
  }, [webRtcSocketRef.current]);

  const initPeerConnection = () => {
    const peerConstraints = {
      iceServers: peerMaster.config.iceServers,
    };
    const peerConnection = new RTCPeerConnection(peerConstraints);
    console.log("peerConnection init!");
    setConnecting(true);
    setConnected(false);

    peerConnection.addEventListener("track", (e) => {
      console.log("peerConnection:: on track ", e);
      setRemoteStream(e.streams[0]);
    });

    peerConnection.addEventListener("connectionstatechange", (e) => {
      console.log(
        "peerConnection:: connectionstatechange",
        peerConnection.connectionState
      );
      switch (peerConnection.connectionState) {
        case "connected":
          setConnected(true);
          setConnecting(false);
          break;
        case "closed":
        case "disconnected":
        case "failed":
          setConnected(false);
          setConnecting(false);
          onRefresh();
          break;
      }
    });
    peerConnection.addEventListener("negotiationneeded", (e) => {
      console.log("peerConnection:: negotiationneeded");
      setNegotiationNeeded(true);
    });
    peerConnection.addEventListener("icecandidateerror", (e) => {
      // console.log('peerConnection:: icecandidateerror', e);
    });
    peerConnection.addEventListener("icecandidate", (e) => {
      console.log("peerConnection:: icecandidate", e.candidate);
      if (!e.candidate) {
        return;
      }
      //* trickle 상태를 유지하기 위해 곧바로 Customer에게 ice candidate 전달
      webRtcSocketRef.current.emit("candidate", {
        candidate: e.candidate,
        sender: userType,
      });
    });
    peerConnection.addEventListener("iceconnectionstatechange", (e) => {
      console.log(
        "peerConnection:: iceconnectionstatechange",
        peerConnection.iceConnectionState
      );
    });

    peerConnection.addEventListener("icegatheringstatechange", (e) => {
      console.log(
        "peerConnection:: icegatheringstatechange",
        peerConnection.iceGatheringState
      );
      switch (peerConnection.iceGatheringState) {
        case "complete":
          setNegotiationNeeded(false);
          console.log(
            "peerConnection:: icegatheringstatechange",
            peerConnection.iceGatheringState,
            peerConnection.connectionState
          );
          if (peerConnection.connectionState === "failed") {
            onRefresh();
          }
          break;
      }
    });
    return peerConnection;
  };

  useEffect(() => {
    if (peerConnectionRef.current) {
      (async () => {
        if (navigator.mediaDevices) {
          console.log("set local user media");
          let s = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          s.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.enabled = cameraOnYn;
            } else if (track.kind === "audio") {
              track.enabled = micOnYn;
            }
            console.log(track, localStreamRef.current);
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
            localStreamRef.current.addTrack(track);
          });
          return () => {
            s.getTracks().forEach((track) => {
              track.stop();
            });
          };
        } else {
          // throw new Error('webcam not supported');
        }
      })();
    }
  }, [peerConnectionRef.current, navigator.mediaDevices]);

  useEffect(() => {
    if (
      userType === 'DEALER' &&
      peerConnectionRef.current &&
      localStreamRef.current &&
      playerRef.current
    ) {
      (async () => {
        if (navigator.mediaDevices) {
          // Hide the video element to prevent showing old stream briefly
          playerRef.current.style.visibility = 'hidden';

          // Check if the srcObject is an instance of MediaStream
          if (playerRef.current.srcObject instanceof MediaStream) {
            playerRef.current.srcObject
              .getVideoTracks()
              .forEach((track) => track.stop());
          }

          console.log('screen sharing yn: ', screenSharingYn);
          let s;
          if (screenSharingYn) {
            s = await navigator.mediaDevices.getDisplayMedia({
              video: true,
              audio: false,
            });
          } else {
            playerRef.current.style.opacity = '0';

            if (!cameraOnYn) {
              socketRef.current.emit('camera', {
                roomId: chatRoomId,
                sender: userType,
                onYn: false,
              });
            }

            s = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });

            playerRef.current.style.opacity = '1';
          }
          const newVideoTrack = s
            .getVideoTracks()
            .filter((i) => i.readyState !== 'ended')[0];

          newVideoTrack.onended = (e) => {
            playerRef.current.style.opacity = '0';

            if (playerRef.current.srcObject instanceof MediaStream) {
              playerRef.current.srcObject
                .getVideoTracks()
                .forEach((track) => track.stop());
            }

            if (!cameraOnYn) {
              socketRef.current.emit('camera', {
                roomId: chatRoomId,
                sender: userType,
                onYn: false,
              });
            }

            playerRef.current.style.opacity = '1';

            if (screenSharingYn) setScreenSharingYn(false);
          };
          const videoSender = peerConnectionRef.current
            .getSenders()
            .filter((i) => i.track?.kind === 'video');

          videoSender.forEach((sender) => {
            sender.replaceTrack(newVideoTrack);

            if (screenSharingYn) {
              console.log('post send camera screenSharingYn', screenSharingYn);
              console.log('post send camera cameraOnYn', cameraOnYn);

              if (!cameraOnYn) {
                socketRef.current.emit('camera', {
                  roomId: chatRoomId,
                  sender: userType,
                  onYn: true,
                });
              }
            } else {
              console.log('post send camera screenSharingYn', screenSharingYn);
              console.log('post send camera cameraOnYn', cameraOnYn);
              if (!cameraOnYn) {
                socketRef.current.emit('camera', {
                  roomId: chatRoomId,
                  sender: userType,
                  onYn: false,
                });
              }
            }
          });

          playerRef.current.srcObject = s;

          // Make the video element visible again
          playerRef.current.style.visibility = 'visible';
        } else {
          // throw new Error("webcam not supported");
        }
      })();

      // return () => {
      //   s.getVideoTracks().forEach((track) => {
      //     track.stop();
      //   });
      // };
    }
  }, [screenSharingYn]);

  useEffect(() => {
    if (negotiationNeeded && peerJoinYn) {
      (async () => {
        if (userType === "DEALER") {
          const sessionConstraints: RTCAnswerOptions = {
            mandatory: {
              OfferToReceiveAudio: true,
              OfferToReceiveVideo: true,
            },
          };
          const offerDescription = await peerConnectionRef.current.createOffer(
            sessionConstraints
          );
          console.log("createoffer ~ offerDescription", offerDescription);
          await peerConnectionRef.current.setLocalDescription(offerDescription);
          webRtcSocketRef.current.emit("offer", {
            sdp: offerDescription,
            sender: userType,
          });
        }
      })();
    }
  }, [negotiationNeeded, peerJoinYn]);

  useEffect(() => {
    if (remoteStream && remotePlayerRef.current) {
      remotePlayerRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remotePlayerRef.current]);

  useEffect(() => {
    localStreamRef.current
      .getVideoTracks()
      .forEach((track) => (track.enabled = cameraOnYn));

    console.log("send camera socket", cameraOnYn);
    socketRef.current.emit("camera", {
      roomId: chatRoomId,
      sender: userType,
      onYn: cameraOnYn,
    });
  }, [cameraOnYn]);

  useEffect(() => {
    localStreamRef.current
      .getAudioTracks()
      .forEach((track) => (track.enabled = micOnYn));

    socketRef.current.emit("microphone", {
      roomId: chatRoomId,
      sender: userType,
      onYn: micOnYn,
    });
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
    console.log(remoteStream);
    if (remoteStream) {
      if (remoteStream.getAudioTracks()?.length > 0) {
        remoteStream.getAudioTracks()[0].enabled = customerMicOnYn;
        console.log("remote mic on? off? " + customerMicOnYn);
      }
    }
  }, [customerMicOnYn]);

  useEffect(() => {
    //* ice connection 상태가 completed 일 경우 remoteStream 설정
    if (connected) {
      console.log("completed!!");
      setStartTime((prev) => prev || moment());

      socketRef.current.emit("microphone", {
        roomId: chatRoomId,
        sender: userType,
        onYn: micOnYn,
      });
      console.log("send connected camera socket", cameraOnYn);
      socketRef.current.emit("camera", {
        roomId: chatRoomId,
        sender: userType,
        onYn: cameraOnYn,
      });
    }
  }, [connected]);

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

  const allowChangeDevice = useCallback(() => {
    if (!socketRef.current) return alert("why");
    console.log(socketRef.current);
    socketRef.current?.emit("switchDevice", {
      roomId: chatRoomId,
      sender: userType,
      deviceType: "WEB",
      switchStatus: "ALLOW",
    });
    // allow 후 device switching = true
    setDeviceSwitchingYn(true);
    setDeviceSwitchRequested(false);
  }, [socketRef.current]);

  const rejectChangeDevice = useCallback(() => {
    socketRef.current?.emit("switchDevice", {
      roomId: chatRoomId,
      sender: userType,
      deviceType: "WEB",
      switchStatus: "REJECT",
    });
    //reject시 nothing
    setDeviceSwitchRequested(false);
  }, [socketRef.current]);

  const onRefresh = () => {
    console.log("refreshing start");
    peerConnectionRef.current?.close();
    peerConnectionRef.current = initPeerConnection();
    setNetworkErrored(false);
  };
  const leaveSocket = useCallback(() => {
    console.log("leave");
    socketRef.current?.emit("leave", { roomId: chatRoomId, sender: userType });
    setLeftYn(true);
  }, [socketRef.current, chatRoomId]);

  const stop = useCallback(
    (refreshing = false) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
          mediaStream.getTracks().forEach((track) => {
            track.stop();
            localStreamRef.current?.removeTrack(track);
            console.log("local track stopped");
          });
        });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          // track.stop();
          track.stop();
          localStreamRef.current.removeTrack(track);
        });
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
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
      setDeviceSwitchingYn(false);
      flushWebRTCSocket();
    },
    [localStreamRef.current, peerConnectionRef.current, remoteStream]
  );

  const flushWebRTCSocket = () => {
    console.log('flush');
    let socket: Socket;
    const manager = new Manager(SOCKET_URI, { transports: ['websocket'] });
    socket = manager.socket(SOCKET_NAMESPACE); // main namespace
    socket.off('getCandidate', getCandidate);
    socket.off('getAnswer', getAnswer);
    socket.off('all_users', allUsers);
    socket.disconnect();
  };

  const getCandidate = ({ candidate, sender }) => {
    const isMe = sender === 'DEALER';
    if (!isMe) {
      handleRemoteCandidate(candidate);
    }
  };

  const processCandidates = () => {
    if (remoteCandidates.length < 1) {
      return;
    }
    try {
      remoteCandidates.forEach((candidate) => {
        if (candidate) {
          peerConnectionRef.current.addIceCandidate(candidate);
        }
      });
      setRemoteCandidates([]);
    } catch (e) {}
  };

  const setRemoteDescription = async (offer) => {
    try {
      const answerDescription = new RTCSessionDescription(offer);
      await peerConnectionRef.current.setRemoteDescription(answerDescription);

      processCandidates();
    } catch (e) {
      console.error('setRemoteDescription ~ error ~', e);
    }
  };

  const getAnswer = async ({ sdp, sender }) => {
    const isMe = sender === 'DEALER';
    if (!isMe) {
      await setRemoteDescription(sdp);
    }
  };

  const allUsers = async (all_users) => {
    const users = all_users.filter((i) => i.sender !== 'DEALER');
    const len = users.length;

    //* room에 두명 이상 있을 시 handshake 로직 시작
    if (len > 0) {
      // await sendOffer();
      setPeerJoinYn(true);
    }
  };

  const handleRemoteCandidate = (iceCandidate) => {
    try {
      const newCandidate = new RTCIceCandidate(iceCandidate);
      if (
        peerConnectionRef.current === null ||
        peerConnectionRef.current?.remoteDescription == null
      ) {
        remoteCandidates.push(newCandidate);
      } else {
        if (newCandidate) {
          peerConnectionRef.current.addIceCandidate(newCandidate);
        }
      }
    } catch (e) {}
  };

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
      deviceChangeStartYn,
      deviceSwitchingYn,
      deviceSwitchRequested,
      deviceSwitchSucceeded,
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
      deviceChangeStartYn,
      deviceSwitchingYn,
      deviceSwitchRequested,
      deviceSwitchSucceeded,
    ]
  );
  const stream = useMemo(() => {
    return { localStream: localStreamRef.current, remoteStream };
  }, [localStreamRef.current, remoteStream]);

  const sockets = useMemo(() => {
    return socketRef.current;
  }, [socketRef.current]);

  return {
    mediaStatus,
    connectStatus,
    stream,
    setCameraOnYn,
    setMicOnYn,
    setScreenSharingYn,
    setDeviceChangeStartYn,
    onStop: stop,
    onStart: () => {}, // setLocalStreamVideo,
    onAllowDeviceChange: allowChangeDevice,
    onRejectDeviceChange: rejectChangeDevice,
    leaveSocket,
    onRefresh,
    socketInstance: sockets,
    setDeviceSwitchRequested,
    setDeviceSwitchSucceeded,
    setDeviceSwitchingYn,
    player: {
      playerRef,
      remotePlayerRef,
    },
  };
};

export default Rtc;
