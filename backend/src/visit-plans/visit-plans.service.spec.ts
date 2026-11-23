import { ConflictException, NotFoundException } from '@nestjs/common';
import { VisitPlansService } from './visit-plans.service';

const example = {
  name: 'Liburan Akhir Pekan',
  destinationId: 'baturraden',
  destinationName: 'Lokawisata Baturraden',
  visitDate: '2027-01-20',
  participantCount: 2,
  isCompleted: false,
};

describe('VisitPlansService', () => {
  let service: VisitPlansService;

  beforeEach(() => {
    service = new VisitPlansService();
  });

  it('membuat dan mengambil daftar rencana', () => {
    const saved = service.create(example);
    expect(saved.id).toBeTruthy();
    expect(service.findAll()).toHaveLength(1);
    expect(service.findOne(saved.id).name).toBe(example.name);
  });

  it('mengubah dan menghapus rencana', () => {
    const saved = service.create(example);
    expect(service.update(saved.id, { participantCount: 5 }).participantCount).toBe(5);
    expect(service.remove(saved.id).message).toContain('berhasil');
    expect(service.findAll()).toHaveLength(0);
  });

  it('menolak data duplikat dengan ConflictException', () => {
    service.create(example);
    expect(() => service.create(example)).toThrow(ConflictException);
  });

  it('mengembalikan NotFoundException untuk ID tidak dikenal', () => {
    expect(() => service.findOne('tidak-ada')).toThrow(NotFoundException);
    expect(() => service.remove('tidak-ada')).toThrow(NotFoundException);
  });
});
