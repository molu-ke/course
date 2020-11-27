// 音乐
class Music {
  constructor(name) {
    this.audio = new Audio();
    this.load(name);
  }
  load(name) {
    this.audio.src = `../mp3/${name}.mp3`;
  }
  play() {
    // 0  没有关于音频是否就绪的消息
    // 1  没有元数据
    // 2  当前播放位置的数据是有效的 但是不能播放下一秒（没有足够的数据毫秒/帧）
    // 3  当前以及下一帧/秒的数据是可用的
    // 4  当前数据足以开始播放 资源准备完毕
    if (this.audio.readyState === 4) {
      this.audio.play();
    }
  }
  pause() {
    this.audio.pause();
  }
}

export default Music;
