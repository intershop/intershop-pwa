import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

/**
 * The CMS Video Component integrates a CMS managed video either via native video tag
 * or for selected video hosting platforms with the appropriate iframe embedding.
 * Currently supported video hosting: Youtube, Vimeo.
 */
@Component({
  selector: 'ish-cms-video',
  templateUrl: './cms-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSVideoComponent implements CMSComponent, OnInit {
  @Input() pagelet: ContentPageletView;

  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  video: string;
  nativeVideoUrl: SafeUrl;
  iframeVideoUrl: SafeUrl;
  videoHeight = '';
  videoWidth = '';
  autoplay: boolean;
  mute: boolean;
  playing: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * deferred loading flag
   */
  showVideo = false;

  ngOnInit() {
    this.video = this.pagelet.stringParam('Video');
    this.autoplay = this.pagelet.booleanParam('Autoplay');
    this.mute = this.pagelet.booleanParam('Mute');
    this.processVideoSize();
    this.processVideoUrl();
  }

  private processVideoSize() {
    const videoSize = this.pagelet.stringParam('VideoSizePreset');
    if (videoSize) {
      if (videoSize === 'custom') {
        this.videoWidth = this.pagelet.stringParam('VideoWidth');
        this.videoHeight = this.pagelet.stringParam('VideoHeight');
      } else {
        const split = videoSize.split('x');
        this.videoWidth = split[0];
        this.videoHeight = split[1];
      }
    }
  }

  /**
   * Process video URL by trying different processors.
   * If all fail, fall back to the default processor
   */
  private processVideoUrl() {
    if (!this.tryProcessYoutubeVideo() && !this.tryProcessVimeoVideo()) {
      this.tryProcessDefaultVideo();
    }
  }

  tryProcessDefaultVideo() {
    this.nativeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video);
  }

  /**
   * process video URL with a YouTube video ID regex (https://github.com/regexhq/youtube-regex)
   */
  tryProcessYoutubeVideo(): boolean {
    const youtubeVideoRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i;
    if (youtubeVideoRegex.test(this.video)) {
      const videoId = youtubeVideoRegex.exec(this.video)[1];
      const videoUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
      if (this.autoplay) {
        videoUrl.searchParams.set('autoplay', '1');
      }
      if (this.mute) {
        videoUrl.searchParams.set('mute', '1');
      }
      this.iframeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl.toString());
      return true;
    }
    return false;
  }

  /**
   * process video URL with a Vimeo video ID regex (https://github.com/regexhq/vimeo-regex)
   */
  tryProcessVimeoVideo(): boolean {
    const vimeoVideoRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/i;
    if (vimeoVideoRegex.test(this.video)) {
      const videoId = vimeoVideoRegex.exec(this.video)[4];
      const videoUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
      if (this.autoplay) {
        videoUrl.searchParams.set('autoplay', '1');
      }
      if (this.mute) {
        videoUrl.searchParams.set('muted', '1');
      }
      this.iframeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl.toString());
      return true;
    }
    return false;
  }

  playVideo() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.controls = 'controls';
    videoElement.play();
  }
}
