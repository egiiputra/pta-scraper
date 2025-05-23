import './App.css'
import { useState, type FormEvent, type FormEventHandler } from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDown, Download } from 'lucide-react';
import { cn } from './lib/utils'

const faculties: Record<string, string> = {
  fh: 'Hukum',
  fp: 'Pertanian',
  feb: 'Ekonomi dan Bisnis',
  ft: 'Teknik',
  fisib: 'Ilmu Sosial dan Ilmu Budaya',
  fkis: 'Keislaman',
  fkip: 'Pendidikan',
}

const prodi: string[] = [
  'ilmu-hukum',
  'magister-ilmu-hukum',
  'teknologi-industri-pertanian',
  'agribisnis',
  'agroteknologi',
  'ilmu-kelautan',
  'manajemen-sumberdaya-perairan',
  'magister-pengelolaan-sda',
  'ekonomi-pembangunan',
  'manajemen',
  'akuntansi',
  'd3-akuntansi',
  'magister-manajemen',
  'magister-akuntansi',
  'd3-enterpreneurship',
  'magister-ilmu-ekonomi',
  'teknik-industri',
  'teknik-informatika',
  'manajemen-informatika',
  'teknik-multimedia-dan-jaringan',
  'mekatronika',
  'teknik-elektro',
  'teknik-mekatronika',
  'sosiologi',
  'ilmu-komunikasi',
  'psikologi',
  'sastra-inggris',
  'ekonomi-syariah',
  'hukum-bisnis-syariah',
  'pgsd',
  'pendidikan-bahasa-indonesia',
  'pendidikan-informatika',
  'pendidikan-ipa',
  'pgpaud',
]

type JournalInfo = {
  judul: string;
  penulis: string;
  pembimbing1: string;
  pembimbing2: string;
  abstract: undefined | string;
  abstraksi: undefined | string;
}

function App() {
  const [ includeAbstract, setIncludeAbstract] = useState(false)
  const [ data, setData ] = useState<JournalInfo[]>([])

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    // @ts-ignore
    const formData = new FormData(event.target);
    console.log(formData.get('selectBy'))
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues);
     // Handle form submission logic here
    fetch(`/api/journals/${formValues.searchBy}?startPage=${formValues.startPage}&endPage=${formValues.endPage}&includeAbstract=${includeAbstract}`)
      .then(res => res.json())
      .then(data => setData(data))
  };

  function downloadJSONAsCSV() {
    let csvData = jsonToCsv(data); // Add .items.data
    // Create a CSV file and allow the user to download it
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
  }

  function jsonToCsv(jsonData: JournalInfo[]) {
    let csv = '';
    // Get the headers
    let headers = Object.keys(jsonData[0]);
    csv += headers.join(',') + '\n';
    // Add the data
    jsonData.forEach(function (row: JournalInfo) {
        // @ts-ignore
        let data = headers.map(header => JSON.stringify(row[header])).join(','); // Add JSON.stringify statement
        csv += data + '\n';
    });
    return csv;
  }

  return (
    <div className="w-vw">
      <div className="w-8/10 mx-auto flex flex-col h-svh">
        <h1 className="text-4xl pt-10 mb-5">Scraper Portal Tugas Akhir UTM </h1>

        <form onSubmit={handleSubmit} className="w-full items-center mb-5">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-3">
              <Label htmlFor="searchBy">Select by</Label>
              <Select name="searchBy" required={true}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="select prodi or fakultas" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectGroup>
                    <SelectLabel>Fakultas</SelectLabel>
                    {Object.entries(faculties).map(([val, text], _) =>
                      <SelectItem value={val}>{text}</SelectItem>
                    )}
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Fakultas</SelectLabel>
                    {prodi.map((val, _) =>
                      <SelectItem value={val}>{val.split('-').join(' ')}</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Label htmlFor="startPage">page start</Label>
              <Select name="startPage" defaultValue="1">
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {Array.from({ length: 20 }, (_, index) => index+1).map((val, _) =>
                    <SelectItem value={val.toString()}>{val}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Label htmlFor="endPage">page end</Label>
              <Select name="endPage" defaultValue="1">
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {Array.from({ length: 20 }, (_, index) => index+1).map((val, _) =>
                    <SelectItem value={val.toString()}>{val}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Label>Include abstract?</Label>
              <Checkbox 
                id="includeAbstract"
                name="includeAbstract"
                checked={includeAbstract}
                onClick={() => setIncludeAbstract(!includeAbstract)}/>
            </div>
          </div>

          <div className="flex flex-row gap-3 mt-5">
            <Button type="submit" className="bg-green-600">
              <Download/> Scrape
            </Button>
            <Button className="bg-blue-500" onClick={downloadJSONAsCSV}>
              <FileDown /> Download CSV
            </Button>
          </div>
        </form>
        <div className="overflow-x-auto overflow-y-scroll flex-grow">
          <table 
            className={cn(
              includeAbstract ? "w-[2600px]":"min-w-full w-auto",
              "block"
            )}
          >
            <thead>
              <tr className="border-b-1 border-gray-400 h-[30px]">
                <th className="w-[400px] text-left py-1 px-2">Judul</th>
                <th className="w-[200px] text-left py-1 px-2">Penulis</th>
                <th className="w-[200px] text-left py-1 px-2">Pembimbing 1</th>
                <th className="w-[200px] text-left py-1 px-2">Pembimbing 2</th>
                {includeAbstract && (
                  <>
                  <th className="w-[800px] text-left py-1 px-2">Abstraksi 2</th>
                  <th className="w-[800px] text-left py-1 px-2">Abstract</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="">
              {data.map((row, _) => 
                <tr className="border-b-1 border-gray-200">
                  <td className="text-wrap py-1 px-2">{row.judul}</td>
                  <td className="text-wrap py-1 px-2">{row.penulis}</td>
                  <td className="text-wrap py-1 px-2">{row.pembimbing1}</td>
                  <td className="text-wrap py-1 px-2">{row.pembimbing2}</td>
                  {includeAbstract && (
                    <>
                    <td className="text-wrap py-1 px-2">{row.abstraksi}</td>
                    <td className="text-wrap py-1 px-2">{row.abstract}</td>
                    </>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
