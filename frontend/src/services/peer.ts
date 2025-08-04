class PeerService {
    public peer!: RTCPeerConnection;
    constructor() {
        if (!this.peer){
            this.peer = new RTCPeerConnection()
        }
    }
    async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            return offer;
        }
    }

    async getAnswer(offer:any){
        if (this.peer){
            await this.peer.setRemoteDescription(offer);
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        }
    }

    async setRemote(ans:any){
        if (this.peer){
            await this.peer.setRemoteDescription(ans);
        }
    }
}

export default new PeerService();