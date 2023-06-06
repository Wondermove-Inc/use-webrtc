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
    SIGNAL_SOCKET_URI,
    SIGNAL_SOCKET_NAMESPACE,
  },
}) => {
  const SERVER_URI: string = WEBRTC_URI;
  const SERVER_SLAVE_URI: string = WEBRTC_SLAVE_URI;
  const SERVER_PORT = parseInt(WEBRTC_PORT);

  const [cameraOnYn, setCameraOnYn] = useState<boolean>(true);
  const [micOnYn, setMicOnYn] = useState<boolean>(true);
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

  const [remoteTracks, setRemoteTracks] = useState<any>([]);

  const userType: UserType = dealerYn ? "DEALER" : "CUSTOMER";

  const playerRef = useRef<HTMLVideoElement>();
  const remotePlayerRef = useRef<HTMLVideoElement>();
  const webRtcSocketRef = useRef<Socket>();

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

  const replaceTracks = useCallback(
    (newStream: MediaStream, isScreenShare = false) => {
      if (!localStream || !local || !playerRef.current) return;
      const originalVideoTrack = localStream.getVideoTracks()[0];
      const newVideoTrack = newStream
        .getVideoTracks()
        .filter((i) => i.readyState !== "ended")[0];
      const videoSender = local
        .getSenders()
        .filter((i) => i.track?.kind === "video");

      localStream.getVideoTracks().forEach((track) => track.stop());

      newVideoTrack.onended = (e) => {
        if (isScreenShare) {
          setScreenSharingYn(false);
        }
      };
      localStream.addTrack(newVideoTrack);
      videoSender.forEach((sender) => {
        sender.replaceTrack(newVideoTrack);
      });
      playerRef.current.srcObject = newStream;
    },
    [localStream, playerRef, local]
  );
  const setLocalStreamVideo = useCallback(async () => {
    try {
      if (navigator.mediaDevices) {
        let s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("user camera stream", s);
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
        s.addEventListener("addtrack", function (e) {
          console.log("localstream:: on add track ", e);
        });

        if (!localStream) setLocalStream(s);
        else {
          console.log("bbb");
          replaceTracks(s);
          //   setLocalStream(localStream);
        }
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
        console.log("screen video", s.getTracks());
        if (!localStream) {
          let stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          s.addTrack(stream.getAudioTracks()[0]);
        }

        if (!localStream) setLocalStream(s);
        else {
          replaceTracks(s, true);

          //   setLocalStream(localStream);
        }
      }
    } catch (e) {
      console.error(e);
      setScreenSharingYn(false);
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

  //! initial offer
  const sendOffer = useCallback(
    async (socket) => {
      const sessionConstraints: RTCAnswerOptions = {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
      };
      let offerDescription;
      try {
        if (!local) throw new Error("local is null");
        offerDescription = await local.createOffer(sessionConstraints);
        console.log("createoffer ~ offerDescription", offerDescription);
        await local.setLocalDescription(offerDescription);

        //!Send the offerDescription to customer.
        socket.emit("offer", { sdp: offerDescription, sender: userType });
      } catch (error) {
        console.error("createOffer ~ line 363 ~ error ~ ", error);
      }
    },
    [local]
  );

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
    if (local) {
      local.close();
      setLocal(null);
    }
    if (mediaConnection) {
      mediaConnection.close();
      setMediaConnection(null);
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
  }, [localStream, remoteStream, local, mediaConnection]);

  const leaveSocket = useCallback(() => {
    console.log("leave");
    socketInstance?.emit("leave", { roomId: chatRoomId, sender: userType });
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
        // socket.emit('leave', { roomId: chatRoomId, sender: userType });
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
      console.log(`socket join, { roomId: ${_id}, sender: '${userType}' }`);
      socket.emit("join", { roomId: _id, sender: userType });
      console.log(micOnYn, cameraOnYn);
      socket.emit("microphone", {
        roomId: _id,
        sender: userType,
        onYn: micOnYn,
      });
      socket.emit("camera", {
        roomId: _id,
        sender: userType,
        onYn: cameraOnYn,
      });
      socket.emit("switchDevice", {
        roomId: _id,
        sender: userType,
        deviceType: "WEB",
        switchStatus: "SUCCESS",
      });
    });
    socket.on("microphone", ({ roomId, sender, onYn }) => {
      const isMe: boolean = sender === userType;
      if (!isMe) {
        console.log("socket mic listener onYn : ", onYn);
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
    // socket.on('deviceChanging', ({ roomId, sender, deviceChangingYn }) => {
    //   const isMe: boolean = sender === userType;
    //   if (!isMe) {
    //     console.log('socket deviceChanging listener onYn : ', deviceChangingYn);
    //     setDeviceSwitchingYn(deviceChangingYn);
    //   }
    // });
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

    socket.on("switchDevice", handleSwitching);
    setSocketInstance(socket);
    return socket;
  };

  const handleSwitching = useCallback(
    ({ roomId, sender, deviceType, switchStatus }) => {
      if (sender === "DEALER") {
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
            "asdfjlaksdjflsadjf",
            switchStatus,
            sender,
            deviceSwitchRequested,
            deviceSwitchingYn
          );
          setDeviceSwitchSucceeded(true);
          setDeviceSwitchingYn(false);
        }
        if (switchStatus === "ALLOW" && sender === "DEALER") {
          if (userType === "CUSTOMER") {
            onRefresh();
          }
        }
        if (switchStatus === "REJECT") {
          // 끄기
          console.log(
            "asdfjlaksdjflsadjf",
            switchStatus,
            sender,
            deviceSwitchRequested
          );
          setDeviceSwitchingYn(false); //필요한가?
        }
      }
    },
    [deviceSwitchRequested, deviceSwitchingYn]
  );
  const allowChangeDevice = useCallback(() => {
    if (!socketInstance) return alert("why");
    console.log(socketInstance);
    socketInstance?.emit("switchDevice", {
      roomId: chatRoomId,
      sender: userType,
      deviceType: "WEB",
      switchStatus: "ALLOW",
    });
    // allow 후 device switching = true
    setDeviceSwitchingYn(true);
    setDeviceSwitchRequested(false);
  }, [socketInstance]);

  const rejectChangeDevice = useCallback(() => {
    socketInstance?.emit("switchDevice", {
      roomId: chatRoomId,
      sender: userType,
      deviceType: "WEB",
      switchStatus: "REJECT",
    });
    //reject시 nothing
    setDeviceSwitchRequested(false);
  }, [socketInstance]);

  //! run if received answer from customer
  const setRemoteDescription = async (offer) => {
    try {
      if (!local) throw new Error("local is not defined");
      // Use the received answerDescription
      const answerDescription = new RTCSessionDescription(offer);
      console.log(
        "setRemoteDescription ~ answerDescription",
        answerDescription
      );
      await local.setRemoteDescription(answerDescription);

      setDeviceSwitchSucceeded(false);
      setDeviceSwitchRequested(false);

      //!process leftover candidate
      processCandidates();
    } catch (error) {
      console.error("setRemoteDescription ~ line 410 ~ error ~ ", error);
    }
  };

  //! run if received iceCandidate from customer
  const handleRemoteCandidate = (iceCandidate) => {
    console.log("handle remote candidate", iceCandidate);
    const newCandidate = new RTCIceCandidate(iceCandidate);
    if (local === null || local?.remoteDescription === null) {
      return remoteCandidates.push(newCandidate);
    }
    return local?.addIceCandidate(newCandidate);
  };

  const processCandidates = () => {
    if (remoteCandidates.length < 1) {
      return;
    }
    if (!local) return;
    console.log("remoteCandidates!!!!", remoteCandidates);
    remoteCandidates.map((candidate) => local.addIceCandidate(candidate));
    setRemoteCandidates([]);
  };

  //* Customer에게 ice candidate 받는 소켓
  const getCandidate = ({ candidate, sender }) => {
    const isMe = sender === userType;
    if (!isMe) {
      console.log("getCandidate socket received - customer", candidate);
      handleRemoteCandidate(candidate);
    }
  };

  //* Customer에게 answer 받는 소켓
  const getAnswer = async ({ sdp, sender }) => {
    const isMe = sender === userType;
    if (!isMe) {
      console.log("answer socket received", sdp);
      await setRemoteDescription(sdp);
    }
  };
  //* Dealer에게 offer를 받은 후, answer를 Dealer에게 전송. add 못한 ice candidate 처리.
  const sendAnswer = async (offer) => {
    console.log("webrtc socket send Answer, local, offer", local, offer);
    try {
      if (!local) return;
      console.log("answer socket emit", offer);
      const offerDescription = new RTCSessionDescription(offer);
      await local.setRemoteDescription(offerDescription);
      const answerDescription = await local.createAnswer();
      await local.setLocalDescription(answerDescription);
      webRtcSocketRef.current?.emit("answer", {
        sdp: answerDescription,
        sender: userType,
      });
    } catch (e) {
      console.error("sendAnswer ~ error ~", e);
    } finally {
      processCandidates();
    }
  };
  //* Dealer에게 offer 받는 소켓
  const getOffer = async ({ sdp, sender }) => {
    const isMe = sender === userType;
    console.log("offer socket received", sdp, local);
    if (local && local.connectionState !== "connecting") {
      onRefresh();
    }
    if (!isMe) {
      console.log("offer socket received", sdp);
      await sendAnswer(sdp);
    }
  };

  //* room에 있는 socket-id 받는 소켓
  const allUsers = async (all_users) => {
    console.log("all_users socket received", all_users);
    const users = all_users.filter((i) => i.sender !== userType);
    const len = users.length;

    console.log("all_users length!!!", len);

    //* room에 두명 이상 있을 시 handshake 로직 시작
    if (userType === "DEALER") {
      if (len > 0) {
        // customer Join yn - true 로 변경하거나
        // set customer Jo
        setPeerJoinYn(true);
      }
    }
  };

  //** Socket Initializer
  const webRTCSocketInitializer = useCallback(
    async (_id, firstTime) => {
      // We just call it because we don't need anything else out of it
      // await fetch('/');
      const manager = new Manager(SIGNAL_SOCKET_URI, {
        transports: ["websocket", "polling"],
        secure: true,
      });
      const socket = manager.socket(SIGNAL_SOCKET_NAMESPACE); // main nakmespace

      socket.on("connect", () => {
        console.log("webrtc socket connected");
        socket.emit("join_room", { room: chatRoomId, sender: userType });
      });

      socket.on("getCandidate", getCandidate);
      socket.on("all_users", allUsers);
      socket.on("disconnect", (reason) => {
        console.log("socket disconnected by ", reason); // "ping timeout"
        setWebRtcSocketInstance(undefined);
      });

      if (userType === "CUSTOMER") {
        socket.on("getOffer", getOffer);
      } else {
        socket.on("getAnswer", getAnswer);
      }
      setWebRtcSocketInstance(socket);

      return socket;
    },
    [local]
  );

  useEffect(() => {
    if (peerJoinYn) {
      sendOffer(webRtcSocketRef.current);
    }
  }, [peerJoinYn]);

  // 1. 딜러 입장 시 로컬스트림 세팅
  useEffect(() => {
    console.log("1. 딜러 입장 시 로컬스트림 세팅", localStream);
    if (localStream == null) {
      setLocalStreamVideo();
    }
    return () => {
      console.log("aa=====");
      if (!deviceSwitchingYn) stop();
    };
  }, []);

  useEffect(() => {
    if (localStream && socketInstance) {
      if (localStream.getVideoTracks()) {
        localStream.getVideoTracks()[0].enabled = cameraOnYn;
        console.log("camera on? off? " + cameraOnYn);
        socketInstance.emit("camera", {
          roomId: chatRoomId,
          sender: userType,
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
          sender: userType,
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

  const createPeerConnection = (): RTCPeerConnection => {
    const peerConstraints = {
      iceServers: peerMaster.config.iceServers,
    };
    const peerConnection = new RTCPeerConnection(peerConstraints);

    return peerConnection;
  };

  // // 2. 로컬 Peer id 받고
  useEffect(() => {
    let localPeer: RTCPeerConnection;
    if (local == null) {
      localPeer = createPeerConnection();
      //* local peer에 localStream 등록
      setLocal(localPeer);
      // join_room emit
    }
    return () => {
      setLocal(undefined);
    };
  }, []);

  // // 2. 로컬 Peer id 받고
  useEffect(() => {
    let socket: Socket;
    console.log("socket icandoit rtc");
    (async () => {
      socket = await webRTCSocketInitializer(null, true);
      setWebRtcSocketInstance(socket);
      console.log("join!!");
      // socket.emit('join_room', { room: chatRoomId });
    })();

    return () => {
      if (socket) {
        console.log("socket off");
        socket.removeAllListeners();
        setWebRtcSocketInstance(undefined);
      }
    };
  }, [local]);

  useEffect(() => {
    if (webRtcSocketInstance) {
      webRtcSocketRef.current = webRtcSocketInstance;
    }
    return () => {
      webRtcSocketRef.current = undefined;
    };
  }, [webRtcSocketInstance]);

  useEffect(() => {
    if (local && localStream) {
      console.log("localstream", localStream);
      localStream.addEventListener("addtrack", (e) => {
        console.log("addtrack track~~~", e);
      });
      localStream.addEventListener("removetrack", (e) => {
        console.log("removetrack track~~~", e);
      });
      localStream.getTracks().forEach((track) => {
        console.log("addTrack", track, local);
        local.addTrack(track, localStream);
      });
    }
  }, [localStream, local]);

  useEffect(() => {
    console.log("local peer changed", webRtcSocketInstance);
    if (webRtcSocketInstance && localStream && local) {
      console.log(webRtcSocketInstance, "join");
    }
  }, [webRtcSocketInstance, localStream]);
  useEffect(() => {
    if (local) {
      local.onconnectionstatechange = (event) => {
        console.log("local.connectionState changed:: ", local.connectionState);
        switch (local.connectionState) {
          case "closed":
            console.error("local.connectionState ~ closed ~ line 245 ~ ");
            setNetworkErrored(true);
            // if (!isExiting) {
            //   setErrorText(t('t_live.customer_is_reconnecting'));
            //   setErrorMessageVisible(true);
            //   setErrorModalVisible(true);
            // }
            break;
          default:
            setNetworkErrored(false);
            break;
        }
      };

      //* ice candidate 발생 이벤트
      local.onicecandidate = (event) => {
        if (!event.candidate) {
          return;
        }
        console.log("iceCandidate!!!", event.candidate);

        //* trickle 상태를 유지하기 위해 곧바로 Customer에게 ice candidate 전달
        webRtcSocketInstance?.emit("candidate", {
          candidate: event.candidate,
          sender: userType,
        });
      };

      local.onicecandidateerror = (event) => {
        // console.error('icecandidateerror', event);
      };

      //* ice connection 상태 이벤트. completed일 경우 peer간 연결 성공
      local.oniceconnectionstatechange = (event) => {
        console.log("iceconnectionstatechange", local.iceConnectionState);
        switch (local.iceConnectionState) {
          case "connected":
          case "completed":
            console.log("iceConnectionStateChange ~ completed");
            setConnected(true);
            setNetworkErrored(false);
            break;
          case "disconnected":
            console.error("local.connectionState ~ closed ~ line 282 ~ ");
            if (!deviceSwitchingYn) setNetworkErrored(true);
            break;
          // if (!isExiting) {
          //   setErrorText(t('t_live.customer_is_reconnecting'));
          //   setErrorMessageVisible(true);
          //   setErrorModalVisible(true);
          // }
          default:
            break;
        }
      };

      //* remote stream 받는 이벤트. 후처리를 위해 배열에 저장.
      local.ontrack = (event) => {
        if (event.streams[0].getTracks().length > 1) {
          console.log("track!!!!", JSON.stringify(event.streams[0]));
          setRemoteTracks([...remoteTracks, event.streams[0]]);
        }
      };
    }
    return () => {
      console.log("local peer closed");
      local?.close();
    };
  }, [local]);

  useEffect(() => {
    //* ice connection 상태가 completed 일 경우 remoteStream 설정
    if (connected) {
      console.log("completed!!");
      processTracks();
      setStartTime((prev) => prev || moment());
    }
  }, [connected]);

  //* iceconnectionstatechange가 completed일 경우 remoteStream 처리
  const processTracks = () => {
    console.log("processing tracks", remoteTracks[0]);
    const len = remoteTracks.length;
    setRemoteStream(remoteTracks[len - 1]);
    setRemoteTracks([]);
  };

  // // 3. 받아온 peer id를  rtc 서버에 등록하고, 상대방 아이디가 있는지 확인함
  // useEffect(() => {
  //   if (peerId) {
  //     console.log("peerid: ", peerId, ", finding destination");
  //     findDestination();
  //   }
  // }, [peerId]);

  // // 4. 상대방 아이디 있으면 연결한다.
  // useEffect(() => {
  //   if (!connecting)
  //     if (destination && peerId) {
  //       console.log("destination found: ", destination, ", trying to connect");
  //       connect();
  //     }
  // }, [destination, peerId, connecting]);

  useEffect(() => {
    if (localStream) {
      setCameraOnYn(true);
      setMicOnYn(true);
    } else {
    }
    return () => {
      localStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
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
    console.log("localstream : ", localStream, localStream?.getVideoTracks());

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
  }, [localStream, screenSharingYn]);

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
      const localPeer = createPeerConnection();
      setConnected(false);
      //* local peer에 localStream 등록

      setLocal(localPeer);
      if (remoteStream) {
        // localStream.removeTrack(); // localStream.release();
        remoteStream.getTracks().forEach((track) => {
          track.stop();
          remoteStream.removeTrack(track);
        });
        setRemoteStream(null);
      }
      setRemoteTracks([]);
      // findDestination();
    }
  }, [networkOnline]);

  useEffect(() => {
    if (networkErrored && socketInstance) {
      socketInstance?.emit("consultError", {
        consultId: chatRoomId,
        sender: userType,
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
    return { localStream, remoteStream };
  }, [localStream, remoteStream]);

  return {
    mediaStatus,
    connectStatus,
    stream,
    setCameraOnYn,
    setMicOnYn,
    setScreenSharingYn,
    setDeviceChangeStartYn,
    onStop: stop,
    onStart: setLocalStreamVideo,
    onAllowDeviceChange: allowChangeDevice,
    onRejectDeviceChange: rejectChangeDevice,
    leaveSocket,
    onRefresh,
    socketInstance,
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
