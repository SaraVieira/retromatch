export * from "./create-window";

// {
//     index: 1,
//     url: 'http://adb.arcadeitalia.net/?mame=sfiii2',
//     game_name: 'sfiii2',
//     title: 'Street Fighter III 2nd Impact: Giant Attack (USA 970930)',
//     cloneof: '',
//     manufacturer: 'Capcom',
//     url_image_ingame: 'http://adb.arcadeitalia.net/?mame=sfiii2&type=ingame&resize=0',
//     url_image_title: 'http://adb.arcadeitalia.net/?mame=sfiii2&type=title&resize=0',
//     url_image_marquee: 'http://adb.arcadeitalia.net/?mame=sfiii2&type=marquee&resize=0',
//     url_image_cabinet: 'http://adb.arcadeitalia.net/?mame=sfiii2&type=cabinet&resize=0',
//     url_image_flyer: 'http://adb.arcadeitalia.net/?mame=sfiii2&type=flyer&resize=0',
//     url_icon: 'http://adb.arcadeitalia.net/?mame=sfiii2&type=icon',
//     genre: 'Fighter / Versus',
//     players: 2,
//     year: '1997',
//     status: 'GOOD',
//     history: 'Arc',
//     history_copyright_long: 'Informations provided by\n' +
//       'Arcade History\n' +
//       'http://www.arcade-history.com\n' +
//       '(C) Copyright Alexis Bousiges',
//     history_copyright_short: '(C) arcade-history.com',
//     youtube_video_id: 'Ubj7gIBoyOY',
//     url_video_shortplay: 'http://adb.arcadeitalia.net/download_file.php?tipo=mame_current&codice=sfiii2&entity=shortplay&oper=download&filler=sfiii2.mp4',
//     url_video_shortplay_hd: 'http://adb.arcadeitalia.net/download_file.php?tipo=mame_current&codice=sfiii2&entity=shortplay_hd&oper=download&filler=sfiii2.mp4',
//     emulator_id: 978,
//     emulator_name: 'Mame 0.261 (nov-29 2023)',
//     languages: 'English',
//     rate: 90,
//     short_title: 'Street Fighter III 2nd Impact: Giant Attack',
//     nplayers: '2P sim',
//     input_controls: 'joystick (8-way)',
//     input_buttons: 6,
//     buttons_colors: 'P1_COIN:White:;P1_START:White:;P1_BUTTON1:Red:Jab Punch;P1_BUTTON2:Red:Strong Punch;P1_BUTTON3:Red:Fierce Punch;P1_BUTTON4:Red:Short Kick;P1_BUTTON5:Red:Strong Kick;P1_BUTTON6:Red:Roundhouse Kick;P1_JOYSTICK:Black:;P2_COIN:White:;P2_START:White:;P2_BUTTON1:Blue:;P2_BUTTON2:Blue:;P2_BUTTON3:Blue:;P2_BUTTON4:Blue:;P2_BUTTON5:Blue:;P2_BUTTON6:Blue:;P2_JOYSTICK:Black:;P1_JOYSTICK_UP:Black:Jump;P1_JOYSTICK_DOWN:Black:Crouch;P1_JOYSTICK_LEFT:Black:Left;P1_JOYSTICK_RIGHT:Black:Right',
//     serie: 'Street Fighter',
//     screen_orientation: 'Horizontal',
//     screen_resolution: '384x224px @59.599491Hz'
//   },
export const transformResponse = (data: any, type: string) => {
  if (type === "arcadeDB") {
    return {
      url: data.url,
      title: data.short_title || data.title,
      developer: data.manufacturer,
      images: {
        screenshot: data.url_image_ingame,
        title: data.url_image_title,
        cover: data.url_image_flyer,
      },
      genre: data.genre,
      players: data.players,
      released: data.year,
      videos: {
        youtube: data.youtube_video_id,
        shortplay: data.url_video_shortplay,
      },
      languages:
        typeof data.languages === "string"
          ? [data.languages]
          : [...(data.languages || [])],
      rating: data.rate,
      series: data.series,
    };
  }
};
