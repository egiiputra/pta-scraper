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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Value } from '@radix-ui/react-select'
import { Rows } from 'lucide-react'

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

  return (
    <div className="w-screen">
      <div className="w-8/10 mx-auto">
        <h1 className="text-4xl mt-10 mb-5">Scraper Portal Tugas Akhir UTM </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-wrap gap-3 items-center mb-5">
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
          <Label>Include abstract?</Label>
          <Checkbox 
            id="includeAbstract"
            name="includeAbstract"
            checked={includeAbstract}
            onClick={() => setIncludeAbstract(!includeAbstract)}/>

          <Button type="submit">Scrape</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Pembimbing 1</TableHead>
              <TableHead>Pembimbing 2</TableHead>
              {includeAbstract && (
                <>
                <TableHead>Abstraksi</TableHead>
                <TableHead>Abstract</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, _) => 
              <TableRow>
                <TableCell className="font-medium">{row.judul}</TableCell>
                <TableCell>{row.penulis}</TableCell>
                <TableCell>{row.pembimbing1}</TableCell>
                <TableCell>{row.pembimbing2}</TableCell>
                {includeAbstract && (
                  <>
                  <TableCell>{row.abstraksi}</TableCell>
                  <TableCell>{row.abstract}</TableCell>
                  </>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div>
    </div>
  )
}

export default App
