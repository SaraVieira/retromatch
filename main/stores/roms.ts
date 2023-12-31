import { ipcMain } from "electron";
import Store from "electron-store";
import { unlinkSync } from "fs";
import path from "path";

import { FileInfo, Roms } from "../../types";
import { scrapeGame } from "../helpers/scraping";

export const romsStore = new Store<Roms>({
  name: "roms"
});

export const romInfoOverridesStore = new Store<Roms>({
  name: "romInfoOverrides"
})

export const initRomActions = () => {
  ipcMain.on(
    "update_rom_info",
    async (event, { id, info }: { id: string; info: FileInfo }) => {
      try {
        await romsStore.set(`${id}.info`, info);
        await romInfoOverridesStore.set(`${id}.info`, info);
        event.reply("info_updated", romsStore.get(id));
      } catch (e) {
        console.log(e.message);
      }
    }
  );
  ipcMain.on(
    "keep_rom",
    async (
      event,
      {
        rom,
        duplicates,
        folder
      }: {
        rom: Roms[0];
        duplicates: Roms[0][];
        folder: any;
      }
    ) => {
      try {
        const toDelete = duplicates
          .filter(
            (otherRom) =>
              otherRom !== rom && rom.info.title === otherRom.info.title
          )
          .map((r) => {
            return {
              romPath: path.join(folder.path, [r.name, r.extension].join("")),
              rom
            };
          });
        for (const { romPath, rom } of toDelete) {
          unlinkSync(romPath);
          romsStore.delete(rom.id);
        }

        event.reply("rom_kept", {
          romsStore: romsStore.store
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  );

  ipcMain.on("scrape_folder", async (event, { folder, all }) => {
    const filesToScrape = all
      ? folder.files
      : folder.files.filter((file) => !romsStore.get(file).info);
    let scrapped = 0;
    try {
      await Promise.all(
        filesToScrape.map(async (file) => {
          try {
            const override = romInfoOverridesStore.get(`${file}.info`);
            if (override) {
              romsStore.set(`${file}.info`, override);
            } else {
              const gameInfo = await scrapeGame(
                romsStore.get(file),
                folder.console.screenscrapper_id
              );

              romsStore.set(`${file}.info`, gameInfo);
            }
            event.reply("new_data", romsStore.get(file));
          } catch (e) {
            console.log(e.message);
          } finally {
            scrapped = scrapped + 1;
            event.reply("scrapping", {
              current: scrapped,
              total: filesToScrape.length
            });
          }
        })
      );
    } catch (e) {
      console.log(e.message);
    }
  });

  ipcMain.on("scrape_file", async (event, { file, screenscrapper_id }) => {
    event.reply("scrapping", {
      current: 0,
      total: 1
    });
    try {
      const gameInfo = await scrapeGame(file, screenscrapper_id);

      romsStore.set(`${file.id}.info`, gameInfo);
      event.reply("new_data", romsStore.get(file.id));
    } catch (e) {
      console.log(e.message);
    } finally {
      event.reply("scrapping", {
        current: 1,
        total: 1
      });
    }
  });
};
